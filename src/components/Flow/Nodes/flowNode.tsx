import { useCallback, useEffect, useRef, useState } from 'react';
import { Handle, type NodeProps, Position, useReactFlow, useStore, useUpdateNodeInternals } from '@xyflow/react';
import type { FlowNode, FlowNodeData, OutputType } from '../../../types/types';
import { NodeTypeNodeData } from '../../../types/nodeType';
import { ArrowRight, Info } from 'lucide-react';
import type { AppDispatch } from '../../../store/store';
import { updateNode } from '../../../store/nodesSlice';
import { ToolTypeData } from '../../../types/toolType';
import { OutputTypeData } from '../../../types/outputType';

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
  const [inputTypes, setInputTypes] = useState<OutputType[]>([]);

  // Update node data if inputs change (e.g. via connections)
  const updateNodeDataExt = useCallback(
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
  const edges = useStore((state) => state.edges);
  const nodes = useStore((state) => state.nodes);

  useEffect(() => {
    const connectedEdges = edges.filter((e) => e.target === id);
    const newInputTypes: OutputType[] = connectedEdges
      .map((edge) => nodes.find(n => n.id === edge.source)?.data?.outputType)
      .filter((t): t is OutputType => Boolean(t));

    setInputTypes((prev) => {
      // prevent unnecessary updates if the array is the same
      const isSame =
        prev.length === newInputTypes.length &&
        prev.every((t, i) => t === newInputTypes[i]);

      if (!isSame) {
        updateNodeDataExt({ inputs: newInputTypes });
        return newInputTypes;
      }
      return prev;
    });
  }, [id, edges, nodes, updateNodeDataExt]);

  // Double-click to focus
  const handleDoubleClick = useCallback(() => {
    const viewport = reactFlow.getViewport();
    window.dispatchEvent(
      new CustomEvent('node-focus', { detail: { id, viewport } })
    );
  }, [id, reactFlow]);


  // Make sure edge connection is compatible
  const isCompatibleConnection = (connection: { source: string; target: string }) => {
    const sourceNode = reactFlow.getNode(connection.source) as FlowNode;
    const targetNode = reactFlow.getNode(connection.target) as FlowNode;
    const nodeType = targetNode.data.nodeType;
    const toolType = targetNode.data.toolType;
    if (!nodeType || !toolType) return false;

    const toolMeta = ToolTypeData[nodeType]?.[toolType];
    if (!toolMeta) return false;

    return toolMeta && toolMeta.inTypes.includes(sourceNode.data.outputType);
  };


  // Different handles for different outputs
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, data.outputs, updateNodeInternals]);
  const outputKeys = Object.keys(data.outputs || {});
  const outputSize = outputKeys.length;

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
      <div className={`box-border bg-${NodeTypeNodeData[data.nodeType].bgColor} text-gray-100 font-light flex flex-row items-center justify-between px-3 py-2 gap-4`}>
        <div className="flex flex-row items-center gap-3">
          {/* Example icon */}
          <h4 className="text-sm m-0">{NodeTypeNodeData[data.nodeType].icon}</h4>
          <h3 className="text-sm font-semibold mb-1">{data.toolType}</h3>
        </div>

        {/* Info icon (clickable) */}
        <button
          type="button"
          onClick={() => console.log('Info clicked')}
          className="cursor-pointer text-gray-300 hover:text-white transition-colors"
        >
          <span className="text-lg"><Info size={20} /></span>
        </button>
      </div>
      <div className="p-3 flex justify-between items-center">
        {inputTypes.length != 0 && <div className="flex flex-col gap-2">
          {inputTypes.map((inputType, idx) => {
            const Icon = OutputTypeData[inputType]?.icon;
            if (!Icon) return null;
            return (
              <div key={idx} className="flex items-center">
                <Icon size={120 / (inputTypes.length + 2)} className="text-gray-400" />
              </div>
            );
          })}
        </div>}
        {inputTypes.length != 0 && data.toolType && <div className="flex flex-col gap-2">
          {inputTypes.map((inputType, idx) => {
            const Icon = OutputTypeData[inputType]?.icon;
            if (!Icon) return null;
            return (
              <div key={idx} className="flex items-center">
                <ArrowRight size={90 / (inputTypes.length + 2)} className="text-gray-400" />
              </div>
            );
          })}
        </div>}




        {/* Tool icon */}
        {data.toolType && (() => {
          const tool = ToolTypeData[data.nodeType]?.[data.toolType];
          if (!tool) return null;
          const Icon = tool.icon;
          return (
            <div className={`flex flex-row items-center gap-4 bg-${NodeTypeNodeData[data.nodeType].bgColor} p-2 rounded-full`}>
              <Icon size={40} className="text-gray-200" />
            </div>
          );
        })()}
        {data.outputType && data.toolType && <ArrowRight size={30} className="text-gray-400" />}

        {data.outputType && (() => {
          const Icon = OutputTypeData[data.outputType]?.icon;
          if (!Icon) return null;
          return (
            <Icon size={40} className="text-gray-400" />
          );
        })()}

      </div>



      <Handle
        type="target"
        position={Position.Left}
        style={{ background: 'white' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={true}

      />
      {/* {outputKeys.map((key, index) => (
        <Handle
          key={key} 
          type="source"
          position={Position.Right}
          id={key}
          style={{
            background: "white",
            top: `${40 + index * 25}px`
          }}
          isConnectable={true}
        />
      ))} */
      }
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "white",
        }}
        isConnectable={true}
        isValidConnection={isCompatibleConnection}
      />
    </div>
  );
}

