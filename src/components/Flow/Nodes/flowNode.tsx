import { useCallback, useEffect, useRef } from 'react';
import { Handle, type NodeProps, Position, useReactFlow, useUpdateNodeInternals  } from '@xyflow/react';
import type { FlowNode, FlowNodeData } from '../../../types/types';
import { NodeTypeNodeData } from '../../../types/nodeType';
import { Info } from 'lucide-react';
import type { AppDispatch } from '../../../store/store';
import { updateNode } from '../../../store/nodesSlice';

export function updateNodeData(
  dispatch: AppDispatch,
    node: FlowNode,
    newData: Partial<FlowNodeData>
  ) {
  if (!node) return;
  dispatch(
    updateNode({
      ...node,
      data: {
        ...node.data,
        ...newData,
      },
    })
  );
}


export default function FlowNodeComponent({
  id,
  data,
}: NodeProps<FlowNode>) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const reactFlow = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  // Update node data if inputs change (e.g. via connections)
  const updateNodeData = useCallback(
    (newData: Partial<FlowNode['data']>) => {
      reactFlow.setNodes((nodes) =>
        nodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, ...newData } } : n
        )
      );
    },
    [id, reactFlow]
  );

  // When inputs come from connected nodes
  useEffect(() => {
    const edges = reactFlow.getEdges();
    const connectedEdges = edges.filter((e) => e.target === id);

    const inputs: Record<string, any> = {};

    for (const edge of connectedEdges) {
      const sourceNode = reactFlow.getNode(edge.source);
      if (sourceNode) {
        // you could pick only sourceNode.data.outputs if you want
        inputs[sourceNode.id] = sourceNode.data.outputs;
      }
    }

    updateNodeData({ inputs });
  }, [id, reactFlow, updateNodeData]);

  // Double-click to focus
  const handleDoubleClick = useCallback(() => {
    const viewport = reactFlow.getViewport();
    window.dispatchEvent(
      new CustomEvent('node-focus', { detail: { id, viewport } })
    );
  }, [id, reactFlow]);

  // Different handles for different outputs
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, data.outputs, updateNodeInternals]);
  const outputKeys = Object.keys(data.outputs || {});

  return (
    <div
      ref={nodeRef}
      onDoubleClick={handleDoubleClick}
      style={{
        background: '#1e1f3b',
        borderRadius: 5,
        cursor: 'pointer',
        textAlign: 'center',
        minWidth: 180,
        overflow: 'hidden',
      }}
    >
      <div className={`box-border bg-${NodeTypeNodeData[data.nodeType].bgColor} text-gray-100 font-light flex flex-row items-center justify-between px-3 py-2`}>
        <div className="flex flex-row items-center gap-1">
          {/* Example icon */}
          <h4 className="text-sm m-0">{NodeTypeNodeData[data.nodeType].icon}</h4>
          <h3 className="text-sm font-semibold mb-1">{NodeTypeNodeData[data.nodeType].name}</h3>
        </div>

        {/* Info icon (clickable) */}
        <button
          type="button"
          onClick={() => console.log('Info clicked')}
          className="cursor-pointer text-gray-300 hover:text-white transition-colors"
        >
          <span className="text-lg"><Info size={20}/></span>
        </button>
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-2">ID: {id}</p>

      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'white' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={true}

      />
      {outputKeys.map((key, index) => (
        <Handle
          key={key}
          type="source"
          position={Position.Right}
          id={key}
          style={{
            background: "white",
            top: `${40 + index * 25}px`, // 🔥 staggered vertically
          }}
          isConnectable={true}
        />
      ))}
    </div>
  );
}

