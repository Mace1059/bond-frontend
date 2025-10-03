// src/features/board/Board.tsx
import { useCallback, useRef, useState, useEffect } from 'react';
import { ReactFlow, ConnectionLineType, useReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../../store/store';
import { handleAddNode, useViewportResize } from './boardHandlers';


import {
  snapGrid,
  flowNodeTypes,
  fitViewOptions,
  defaultEdgeOptions
} from './boardConfig';
import {
  createOnNodesChange,
  createOnEdgesChange,
  createOnConnect,
  createOnConnectEnd,
  onNodeDrag
} from './boardHandlers';
import { saveFlowToServer } from './boardAPI';

import '@xyflow/react/dist/style.css';
// import './Board.scss';

interface BoardProps {
  userEmail: string;
  focusedNodeId: string | null;
  onDefocus: () => void;
}


export default function Board({ userEmail, focusedNodeId, onDefocus }: BoardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  const { flow_id: paramFlowId } = useParams<{ flow_id?: string }>();
  // Save state
  const [saving, setSaving] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Select nodes/edges from Redux
  const nodes = useSelector((state: RootState) => Object.values(state.nodes.byId));
  const edges = useSelector((state: RootState) => Object.values(state.edges.byId));
  const getNodes = useCallback(() => nodes, [nodes]);
  const getEdges = useCallback(() => edges, [edges]);


  // Debounced save
  const debouncedSave = useCallback(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    setSaving(true);
    saveTimeout.current = setTimeout(async () => {
      if (paramFlowId) {
        await saveFlowToServer(nodes, edges, paramFlowId, userEmail);
      }
      setSaving(false);
    }, 800); // 0.8s debounce
  }, [nodes, edges, paramFlowId, userEmail]);

  // Auto-fit when flow changes
  useEffect(() => {
    if (paramFlowId) {
      fitView({ padding: 0.4, maxZoom: 0.8 });
    }
  }, [paramFlowId, fitView]);

  // Recenter on focused node when viewport changes
  useViewportResize(focusedNodeId, !focusedNodeId);
  // useFlowContainerResize(focusedNodeId); 

  const handleAddNodeClick = (e: React.MouseEvent) => {
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!bounds) return;

    const position = screenToFlowPosition({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });

    handleAddNode(dispatch, position);
  };

  return (
    <div ref={reactFlowWrapper} style={{ height: 'calc(100vh - 54px)' }}>
      <div className="absolute top-right-container z-10">
        {!focusedNodeId ? (
        <><div className="saving-indicator">
            {saving ? <>💾 saving...</> : <>✅ saved</>}
          </div><div className="fit-view-container">
              <button className="fit-view-button" onClick={() => fitView({ padding: 0.5, maxZoom: 0.8 })}>
                ⬜
              </button>
              <button
                onClick={handleAddNodeClick}
                className="top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
              >
                ＋ Add Node
              </button>
              <span className="tooltip">Go to Nodes in View</span>
            </div></>
      )
      :
      (
        <button
          onClick={onDefocus}
          className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded z-10"
        >
          Return
        </button>
      )
      }
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={flowNodeTypes}
        onNodesChange={createOnNodesChange(dispatch, getNodes, debouncedSave)}
        onEdgesChange={createOnEdgesChange(dispatch, getEdges, debouncedSave)}
        onConnect={createOnConnect(dispatch, debouncedSave)}
        onConnectEnd={createOnConnectEnd(dispatch, debouncedSave, screenToFlowPosition)}
        onNodeDrag={onNodeDrag}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={defaultEdgeOptions}
        onPaneClick={onDefocus} //click empty space to clear focus

      >
        <Background
          id="1"
          gap={25}
          color="#ffffffff"
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
}
