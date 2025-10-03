// FlowPage.tsx (refactored)
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ReactFlowProvider, useReactFlow, type Viewport } from "@xyflow/react";
import Board from "../components/Flow/Board/Board";
import RightSidebar from "../components/Flow/RightSidebar/RightSidebar";
import { zoomToNode } from "../components/Flow/Board/viewUtils";

/**
 * Notes
 * - Consolidated React Flow instance usage to a single `reactFlow` ref
 * - Removed non-null assertions when reading node measurements
 * - Stronger type-narrowing for custom `node-focus` event payload
 * - Centralized animation gating + settle timings
 * - Debounced ResizeObserver via RAF, with careful cleanup
 * - Clear separation of concerns: event wiring, viewport restore, recenter logic, observers
 */

export default function FlowPage() {
  return (
    <div className="w-full h-full flex flex-row">
      <ReactFlowProvider>
        <FlowPageContent />
      </ReactFlowProvider>
    </div>
  );
}

// ---- Constants ------------------------------------------------------------
const SIDEBAR_SETTLE_MS = 600; // smooth settle after opening
const SWITCH_FOCUS_MS = 500;   // smooth jump when switching focused nodes

// ---- Types ----------------------------------------------------------------
interface NodeFocusDetail {
  id: string;
  viewport?: Viewport;
}

function isNodeFocusEvent(e: Event): e is CustomEvent<NodeFocusDetail> {
  return (
    typeof (e as CustomEvent).detail?.id === "string"
  );
}

// ---- Component ------------------------------------------------------------
function FlowPageContent() {
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [previousViewport, setPreviousViewport] = useState<Viewport | null>(null);

  const [sidebarWidth, setSidebarWidth] = useState(() => window.innerWidth * 0.4);
  const [isSidebarResizing, setIsSidebarResizing] = useState(false);
  const [isSidebarAnimating, setIsSidebarAnimating] = useState(false);
  const [isProgrammaticAnimating, setIsProgrammaticAnimating] = useState(false); // gate observer during animations

  const animTimerRef = useRef<number | null>(null);
  const flowAreaRef = useRef<HTMLDivElement>(null);
  const prevSidebarOpenRef = useRef<boolean>(false);
  const lastFocusedIdRef = useRef<string | null>(null);

  const reactFlow = useReactFlow();
  const { setViewport, fitView, getViewport } = reactFlow;

  const sidebarOpen = !!focusedNodeId;

  // Helper: gate observer for an animation window
  const runAnimationGate = useCallback((ms: number) => {
    if (animTimerRef.current) {
      clearTimeout(animTimerRef.current);
      animTimerRef.current = null;
    }
    setIsProgrammaticAnimating(true);
    animTimerRef.current = window.setTimeout(() => {
      setIsProgrammaticAnimating(false);
      animTimerRef.current = null;
    }, ms);
  }, []);

  // Cleanup any pending timers on unmount
  useEffect(() => () => {
    if (animTimerRef.current) clearTimeout(animTimerRef.current);
  }, []);

  // Track open/close transitions of the sidebar
  useEffect(() => {
    const wasOpen = prevSidebarOpenRef.current;
    if (!wasOpen && sidebarOpen) {
      // Opening — guard in case focus handler missed it
      setIsSidebarAnimating(true);
    }
    prevSidebarOpenRef.current = sidebarOpen;
  }, [sidebarOpen]);

  // Focus event wiring — capture first-focus viewport, set focus target
  useEffect(() => {
    const handleFocus = (e: Event) => {
      if (!isNodeFocusEvent(e)) return;
      const { id, viewport } = e.detail;

      // Ignore no-op refocus while open
      if (lastFocusedIdRef.current === id && prevSidebarOpenRef.current) return;

      const wasOpen = prevSidebarOpenRef.current;

      if (!wasOpen) {
        // About to open: mark animating immediately and capture return-to viewport once
        setIsSidebarAnimating(true);
        setPreviousViewport(viewport ?? getViewport());
      }

      lastFocusedIdRef.current = id;
      setFocusedNodeId(id);
    };

    window.addEventListener("node-focus", handleFocus);
    return () => window.removeEventListener("node-focus", handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getViewport]);

  // Restore viewport (ESC): use saved viewport if available, else fit view
  const restorePreviousViewport = useCallback(() => {
    if (previousViewport) {
      setViewport(previousViewport, { duration: 500 });
    } else {
      fitView({ padding: 0.5, maxZoom: 0.8, duration: 300 });
    }
    setFocusedNodeId(null);
    setPreviousViewport(null);
    lastFocusedIdRef.current = null;
  }, [previousViewport, setViewport, fitView]);

  // ESC key handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") restorePreviousViewport();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [restorePreviousViewport]);

  // Smoothly recenter when switching nodes WHILE sidebar is open
  useEffect(() => {
    if (!focusedNodeId || !sidebarOpen || isSidebarAnimating) return;

    const node = reactFlow.getNode(focusedNodeId);
    const w = node?.measured?.width;
    const h = node?.measured?.height;
    if (!node || !w || !h) return;

    const el = flowAreaRef.current;

    // Gate observer during animation
    runAnimationGate(SWITCH_FOCUS_MS);

    // Defer one frame to ensure measurements are fresh
    requestAnimationFrame(() => {
      zoomToNode({
        nodeX: node.position.x,
        nodeY: node.position.y,
        nodeWidth: w,
        nodeHeight: h,
        reactFlow,
        withAnimation: true,
        durationMs: SWITCH_FOCUS_MS,
        viewportOverride: el ? { width: el.clientWidth, height: el.clientHeight } : undefined,
      });
    });
  }, [focusedNodeId, sidebarOpen, isSidebarAnimating, reactFlow, runAnimationGate]);

  // Observe ONLY the left flow area; ignore while opening or animating programmatically
  useEffect(() => {
    const el = flowAreaRef.current;
    if (!el) return;

    let raf = 0;
    const ro = new ResizeObserver(() => {
      if (!focusedNodeId) return;
      if (isSidebarAnimating || isProgrammaticAnimating) return;
      if (raf) cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const node = reactFlow.getNode(focusedNodeId);
        const w = node?.measured?.width;
        const h = node?.measured?.height;
        if (!node || !w || !h) return;

        zoomToNode({
          nodeX: node.position.x,
          nodeY: node.position.y,
          nodeWidth: w,
          nodeHeight: h,
          reactFlow,
          withAnimation: false, // instant during live resize/drag
          viewportOverride: { width: el.clientWidth, height: el.clientHeight },
        });
      });
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [focusedNodeId, reactFlow, isSidebarAnimating, isProgrammaticAnimating]);

  // After sidebar finishes opening, do ONE smooth settle
  const handleSidebarTransitionEnd = useCallback(() => {
    if (!focusedNodeId) {
      setIsSidebarAnimating(false);
      return;
    }

    const node = reactFlow.getNode(focusedNodeId);
    const w = node?.measured?.width;
    const h = node?.measured?.height;
    if (!node || !w || !h) {
      setIsSidebarAnimating(false);
      return;
    }

    const el = flowAreaRef.current;

    // Perform the settle and gate the observer for the duration
    runAnimationGate(SIDEBAR_SETTLE_MS);

    zoomToNode({
      nodeX: node.position.x,
      nodeY: node.position.y,
      nodeWidth: w,
      nodeHeight: h,
      reactFlow,
      withAnimation: true,
      durationMs: SIDEBAR_SETTLE_MS,
      viewportOverride: el ? { width: el.clientWidth, height: el.clientHeight } : undefined,
    });

    // Opening animation complete
    setIsSidebarAnimating(false);
  }, [focusedNodeId, reactFlow, runAnimationGate]);

  const leftWidth = useMemo(() => (sidebarOpen ? `calc(100% - ${sidebarWidth}px)` : "100%"), [sidebarOpen, sidebarWidth]);

  return (
    <>
      {/* FLOW AREA */}
      <div
        ref={flowAreaRef}
        className="h-full min-w-0 box-border"
        style={{
          width: leftWidth,
          transition: isSidebarResizing ? "none" : "width 200ms ease-in-out",
        }}
      >
        <Board
          userEmail=""
          focusedNodeId={focusedNodeId}
          onDefocus={restorePreviousViewport}
        />
      </div>

      {/* SIDEBAR AREA */}
      <RightSidebar
        open={sidebarOpen}
        onClose={restorePreviousViewport}
        nodeId={focusedNodeId}
        onTransitionEnd={handleSidebarTransitionEnd}
        width={sidebarWidth}
        onResize={(w) => {
          setSidebarWidth(w);
          setIsSidebarResizing(true);
        }}
        onResizingChange={setIsSidebarResizing}
      />
    </>
  );
}
