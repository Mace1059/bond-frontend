// src/features/board/boardHandlers.ts
import { type ReactFlowInstance, applyNodeChanges, applyEdgeChanges, type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect, type OnConnectEnd, type OnNodeDrag } from '@xyflow/react';
import { type AppDispatch } from '../../../store/store';
import { setNodes, addNode } from '../../../store/nodesSlice';
import { setEdges, addEdge } from '../../../store/edgesSlice';
import { getId } from './boardConfig';

import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

import { zoomToNode } from './viewUtils';
import { NODE_TYPES, OUTPUT_TYPES } from '../../../types/types';

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
export function createOnNodesChange(dispatch: AppDispatch, getNodes: () => Node[], debouncedSave: () => void): OnNodesChange {
  return (changes) => {
    // ✅ Always use the latest nodes via getNodes()
    const currentNodes = getNodes();
    const updatedNodes = applyNodeChanges(changes, currentNodes);
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
      const id = getId();
      const { clientX, clientY } = 'changedTouches' in event ? event.changedTouches[0] : event;

      const newNode: Node = {
        id,
        position: screenToFlowPosition({ x: clientX, y: clientY }),
        data: { text: '' },
        type: 'blank',
        origin: [0, 0],
      };

      // ✅ Add the node first so React Flow initializes it before edges
      dispatch(addNode(newNode));

      if (connectionState.fromNode) {
        const newEdge: Edge = {
          id: getId(),
          source: connectionState.fromNode.id,
          target: id,
        };
        dispatch(addEdge(newEdge));
      }

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
      name: 'New Node',
      nodeType: NODE_TYPES.blank,
      outputType: OUTPUT_TYPES.json,
      inputs: {},
      outputs: {test: 'data'},
    },
) {
  const newNode: Node = {
    id: getId(),
    type: type,
    position: position,
    data: data
  };

  // ✅ Add node cleanly
  dispatch(addNode(newNode));
}