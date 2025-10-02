// src/features/board/boardHandlers.ts
import { applyNodeChanges, applyEdgeChanges, type Node, type Edge, type OnNodesChange, type OnEdgesChange, type OnConnect, type OnConnectEnd, type OnNodeDrag } from '@xyflow/react';
import { type AppDispatch } from '../../../store/store';
import { setNodes, addNode } from '../../../store/nodesSlice';
import { setEdges, addEdge } from '../../../store/edgesSlice';
import { getId } from './boardConfig';

import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

import { zoomToNode } from './viewUtils';

//===========================
// Viewport Resize Handler
//===========================
export function useViewportResize(focusedNodeId: string | null) {
  const reactFlow = useReactFlow();

  useEffect(() => {
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
  }, [focusedNodeId, reactFlow]);
}


//===========================
// Node Change Handlers
//===========================
export const onNodeDrag: OnNodeDrag = (_, node) => node;

export function createOnNodesChange(dispatch: AppDispatch, nodes: Node[], debouncedSave: () => void): OnNodesChange {
  return changes => {
    if ((changes.length > 1 && changes[1].type !== 'dimensions') || changes[0].type !== 'dimensions' || changes.length === nodes.length) {
      const updatedNodes = applyNodeChanges(changes, nodes);
      dispatch(setNodes(updatedNodes));
      debouncedSave();
    }
  };
}

export function createOnEdgesChange(dispatch: AppDispatch, edges: Edge[], debouncedSave: () => void): OnEdgesChange {
  return changes => {
    const updatedEdges = applyEdgeChanges(changes, edges);
    dispatch(setEdges(updatedEdges));
    debouncedSave();
  };
}

export function createOnConnect(dispatch: AppDispatch, debouncedSave: () => void): OnConnect {
  return connection => {
    const newEdge: Edge = { id: getId(), source: connection.source!, target: connection.target! };
    dispatch(addEdge(newEdge));
    debouncedSave();
  };
}

export function createOnConnectEnd(dispatch: AppDispatch, debouncedSave: () => void, screenToFlowPosition: (pos: {x:number;y:number}) => {x:number;y:number}): OnConnectEnd {
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
      dispatch(addNode(newNode));

      if (connectionState.fromNode) {
        const newEdge: Edge = { id: getId(), source: connectionState.fromNode.id, target: id };
        dispatch(addEdge(newEdge));
        debouncedSave();
      }
    }
  };
}

//===========================
// Node Addition Handler
//===========================
export function handleAddNode(
  dispatch: AppDispatch,
  position: { x: number; y: number },
  type: string = 'blank',
  data: Record<string, any> = { text: 'New Node' }
) {
  const newNode: Node = {
    id: getId(),
    type,
    position,
    data,
    origin: [0, 0],
  };

  dispatch(addNode(newNode));
}