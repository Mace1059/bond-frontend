// src/features/board/boardHandlers.ts
import { type ReactFlowInstance, applyNodeChanges, applyEdgeChanges, type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect, type OnConnectEnd, type OnNodeDrag, type NodeChange } from '@xyflow/react';
import { type AppDispatch } from '../../../store/store';
import { setNodes, addNode, updateNode } from '../../../store/nodesSlice';
import { setEdges, addEdge } from '../../../store/edgesSlice';
import { getId } from './boardConfig';

import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

import { zoomToNode } from './viewUtils';
import { NODE_TYPES, OUTPUT_TYPES } from '../../../types/types';
import { TOOL_TYPE } from '../../../types/toolType';

//===========================
// Viewport Resize Handler
//===========================
function recalcViewportLikeWindow(
  reactFlow: ReactFlowInstance,
  focusedNodeId: string | null,
  animate: boolean
) {
  if (focusedNodeId) {
    const node = reactFlow.getNode(focusedNodeId);
    if (!node || !node.measured?.width || !node.measured?.height) return;

    const containerEl: HTMLElement | undefined = (reactFlow as any).container || undefined;
    const vp = containerEl
      ? { width: containerEl.clientWidth, height: containerEl.clientHeight }
      : undefined;

    zoomToNode({
      nodeX: node.position.x,
      nodeY: node.position.y,
      nodeWidth: node.measured.width,
      nodeHeight: node.measured.height,
      reactFlow,
      withAnimation: animate,
      viewportOverride: vp, // <-- KEY: use canvas size, not window size
    });
  } else {
    reactFlow.fitView({ duration: animate ? 300 : 0 });
  }
}

export function useViewportResize(
  focusedNodeId: string | null,
  enabled = true
) {
  const reactFlow = useReactFlow();

  useEffect(() => {
    if (!enabled) return;

    const handleResize = () => {
      if (focusedNodeId) {
        const node = reactFlow.getNode(focusedNodeId);
        if (!node || !node.measured) return;

        const nodeWidth = node.measured.width;
        const nodeHeight = node.measured.height;
        if (!nodeWidth || !nodeHeight) return;

        zoomToNode({
          nodeX: node.position.x,
          nodeY: node.position.y,
          nodeWidth,
          nodeHeight,
          reactFlow,
          withAnimation: false,
        });
      } else {
        reactFlow.fitView({ duration: 300 });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [focusedNodeId, reactFlow, enabled]);
}

export function useFlowContainerResize(focusedNodeId: string | null) {
  const reactFlow = useReactFlow();

  useEffect(() => {
    const el = (reactFlow as any).container as HTMLElement | undefined;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      recalcViewportLikeWindow(reactFlow, focusedNodeId, false); // identical math to window path
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, [reactFlow, focusedNodeId]);
}



// ===========================
// Node Drag (optional)
// ===========================
export const onNodeDrag: OnNodeDrag = (_, node) => node;

// ===========================
// Nodes Change Handler ✅
// ===========================
function hasNodeId(change: NodeChange): change is NodeChange & { id: string } {
  return "id" in change;
}

export function createOnNodesChange(
  dispatch: AppDispatch,
  getNodes: () => Node[],
  debouncedSave: () => void
): OnNodesChange {
  return (changes: NodeChange[]) => {
    if (changes.length === 0) return;

    const currentNodes = getNodes();
    const updatedNodes = applyNodeChanges(changes, currentNodes);

    // Handle single change with ID (e.g. drag, selection)
    if (changes.length === 1 && hasNodeId(changes[0])) {
      const changedId = changes[0].id;
      const updatedNode = updatedNodes.find((n) => n.id === changedId);
      if (updatedNode) {
        dispatch(updateNode(updatedNode));
        debouncedSave();
        return;
      }
    }

    // Fallback: batch update
    dispatch(setNodes(updatedNodes));
    debouncedSave();
  };
}

// ===========================
// Edges Change Handler
// ===========================
export function createOnEdgesChange(dispatch: AppDispatch, getEdges: () => Edge[], debouncedSave: () => void): OnEdgesChange {
  return (changes) => {
    const currentEdges = getEdges();
    const updatedEdges = applyEdgeChanges(changes, currentEdges);
    dispatch(setEdges(updatedEdges));
    debouncedSave();
  };
}

// ===========================
// Connect Handler
// ===========================
export function createOnConnect(dispatch: AppDispatch, debouncedSave: () => void): OnConnect {
  return (connection) => {
    const newEdge: Edge = {
      id: getId(),
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle ?? undefined, 
      targetHandle: connection.targetHandle ?? undefined,
    };

    dispatch(addEdge(newEdge));
    debouncedSave();
  };
}

// ===========================
// Connect End Handler ✅
// ===========================
export function createOnConnectEnd(
  dispatch: AppDispatch,
  debouncedSave: () => void,
  screenToFlowPosition: (pos: { x: number; y: number }) => { x: number; y: number }
): OnConnectEnd {
  return (event, connectionState) => {
    if (!connectionState.isValid) {
      const { clientX, clientY } =
        'changedTouches' in event ? event.changedTouches[0] : event;

      const position = screenToFlowPosition({ x: clientX, y: clientY });

      handleAddNode(
        dispatch,
        position,
        'flowNode',
        undefined,                                 // uses default node data
        connectionState.fromNode?.id,             // 👈 auto-connect here
        connectionState.fromHandle?.id ?? undefined
      );

      debouncedSave();
    }
  };
}

// ===========================
// Node Addition Handler ✅
// ===========================
export function handleAddNode(
  dispatch: AppDispatch,
  position: { x: number; y: number },
  type: string = 'flowNode',
  data: Record<string, any> = {
    label: 'New Node',
    nodeType: NODE_TYPES.blank,
    outputType: null,
    toolType: null,
    inputs: {},
    outputs: {},
  },
  sourceId?: string,        // 👈 NEW: optional source node ID
  sourceHandleId?: string   // 👈 NEW: optional source handle ID
): string {
  const id = getId();

  const newNode: Node = {
    id,
    type,
    position,
    data,
  };

  dispatch(addNode(newNode));

  // 👇 Automatically connect if sourceId is provided
  if (sourceId) {
    const newEdge: Edge = {
      id: getId(),
      source: sourceId,
      sourceHandle: sourceHandleId,
      target: id,
    };
    dispatch(addEdge(newEdge));
  }

  return id;
}