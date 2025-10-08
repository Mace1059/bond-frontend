// src/features/board/Board.tsx
import { useCallback, useRef, useState, useEffect } from 'react';
import { ReactFlow, ConnectionLineType, useReactFlow, Background, BackgroundVariant } from '@xyflow/react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../../store/store';
import { handleAddNode, useViewportResize } from './boardHandlers';
import { RefreshCcw, CloudCheck, Focus, ZoomIn, ZoomOut, Zap } from 'lucide-react';

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
  const { zoomIn, zoomOut } = useReactFlow();

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

  // Recenter on focused node when viewport changes
  useViewportResize(focusedNodeId, !focusedNodeId);
  // useFlowContainerResize(focusedNodeId); 

  const handleAddNodeClick = (e: React.MouseEvent) => {
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    if (!bounds) return;

    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    handleAddNode(dispatch, position);
  };

  return (
    <div ref={reactFlowWrapper} style={{ height: 'calc(100vh - 54px)' }}>
      <div className="absolute top-left-container z-10 p-4">
        {!focusedNodeId &&
          <div className="saving-indicator flex flex-row gap-2 align-center mb-2">
            {saving ? <><RefreshCcw size={20} />Saving...</> : <><CloudCheck size={20} /> Saved</>}
          </div>
        }
      </div>

      <div className="absolute bottom-4 z-10 p-4">
        {!focusedNodeId && (
          <div className="flex flex-col gap-2 align-center mb-2">
            <div className='flex flex-row'>
              <button className="w-10 h-10 rounded-md flex items-center justify-center transition-colors hover:bg-gray-800/80 overflow-hidden gap-0"
                onClick={() => fitView({ padding: 0.5, maxZoom: 1.5 })}
              >
                <Focus size={20} />
              </button>
              <button className="w-10 h-10 rounded-md flex items-center justify-center transition-colors hover:bg-gray-800/80 overflow-hidden gap-0"
                onClick={() => zoomIn({ duration: 200 })}
              >
                <ZoomIn size={20} />
              </button>
              <button className="w-10 h-10 rounded-md flex items-center justify-center transition-colors hover:bg-gray-800/80 overflow-hidden gap-0"
                onClick={() => zoomOut({ duration: 200 })}
              >
                <ZoomOut size={20} />
              </button>
            </div>
            <button
              onClick={handleAddNodeClick}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Add Node
            </button>
          </div>
        )}
      </div>

      {/* <div className="absolute bottom-4 right-4 z-10 p-4">
        {!focusedNodeId && (
          <div className="flex flex-col gap-2 align-center mb-2">
            <button
              onClick={handleAddNodeClick}
              className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              <Zap size={20} />
              Execute Workflow
            </button>
          </div>
        )}
      </div> */}


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
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={defaultEdgeOptions}
        onPaneClick={onDefocus} //click empty space to clear focus

      >
        <Background
          id="1"
          gap={25}
          color="#a5afc9ff"
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </div>
  );
}
