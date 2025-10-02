import { useState, useCallback, useEffect } from "react";
import { ReactFlowProvider, useReactFlow, type Viewport } from "@xyflow/react";
import Board from "../components/Flow/Board/Board";
import RightSidebar from "../components/Flow/RightSidebar/RightSidebar";
import { zoomToNode } from "../components/Flow/Board/viewUtils";


export default function HomePage() {
  return (
    <div className="w-full h-full flex flex-row">
      <ReactFlowProvider>
        <HomePageContent />
      </ReactFlowProvider>
    </div>
  );
}

function HomePageContent() {
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [previousViewport, setPreviousViewport] = useState<Viewport | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(384);

  const { setViewport, fitView } = useReactFlow();
  const reactFlow = useReactFlow();

  const handleSidebarTransitionEnd = () => {
    if (focusedNodeId) {
      const node = reactFlow.getNode(focusedNodeId);
      if (node && node.measured) {
        const nodeWidth = node.measured.width;
        const nodeHeight = node.measured.height;
        if (!nodeWidth || !nodeHeight) return;

        zoomToNode({
          nodeX: node.position.x,
          nodeY: node.position.y,
          nodeWidth,
          nodeHeight,
          reactFlow,
          withAnimation: true,
        });
      }
    }
  };


  const restorePreviousViewport = useCallback(() => {
    if (previousViewport) {
      setViewport(previousViewport, { duration: 500 });
    } else {
      fitView({ padding: 0.5, maxZoom: 0.8, duration: 300 });
    }
    setFocusedNodeId(null);
    setPreviousViewport(null);
  }, [previousViewport, setViewport, fitView]);

  useEffect(() => {
    const handleFocus = (e: Event) => {
      const { id, viewport } = (e as CustomEvent).detail;
      setFocusedNodeId(id);
      setPreviousViewport(viewport);
    };
    window.addEventListener("node-focus", handleFocus);
    return () => window.removeEventListener("node-focus", handleFocus);
  }, []);

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") restorePreviousViewport();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [restorePreviousViewport]);

  return (
    <>
      {/* FLOW AREA */}
      <div
        className={`transition-[width] duration-300 ease-in-out ${
          focusedNodeId ? "w-[calc(100%-24rem)]" : "w-full"
        }`}
      >
        <Board
          userEmail=""
          focusedNodeId={focusedNodeId}
          onDefocus={restorePreviousViewport}
        />
      </div>

      {/* SIDEBAR AREA */}
      <RightSidebar
        open={!!focusedNodeId}
        onClose={restorePreviousViewport}
        nodeId={focusedNodeId}
        onTransitionEnd={handleSidebarTransitionEnd}
        // width={sidebarWidth}
        // onResize={setSidebarWidth}
      />
    </>
  );
}
