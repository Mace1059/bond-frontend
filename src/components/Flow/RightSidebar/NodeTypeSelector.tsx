import React, { useMemo } from "react";
import { NodeTypeNodeData } from "../../Flow/Nodes/nodeType";
import type { FlowNode } from "../../../types/types";
import type { NodeType, OutputType } from "../../../types/types";
import { useReactFlow } from "@xyflow/react";

interface NodeTypeSelectorProps {
  currentNode: FlowNode | null; // Allow null
  onSelect: (nodeType: NodeType) => void;
}

export const NodeTypeSelector: React.FC<NodeTypeSelectorProps> = ({
  currentNode,
  onSelect,
}) => {
  const rf = useReactFlow();

  // Always call hooks, even if currentNode is null.
  const inputTypes = useMemo<OutputType[]>(() => {
    if (!currentNode?.id) return [];
    const incoming = rf.getEdges().filter((e) => e.target === currentNode.id);
    return incoming
      .map((e) => {
        const src = rf.getNode(e.source) as FlowNode | undefined;
        return src?.data?.outputType as OutputType | undefined;
      })
      .filter((t): t is OutputType => !!t);
  }, [rf, currentNode?.id]);

  const outputTypes = useMemo<OutputType[]>(() => {
    if (!currentNode?.data) return [];
    const t = currentNode.data.outputType as OutputType | undefined;
    return t ? [t] : [];
  }, [currentNode?.data]);

  if (!currentNode) {
    return <div className="text-sm text-gray-500 italic">No node selected.</div>;
  }

  const checkCandidate = (candidate: NodeType) => {
    const meta = NodeTypeNodeData[candidate];
    const invalidInputs = inputTypes.filter((t) => !meta.inTypes.includes(t));
    const invalidOutputs = outputTypes.filter((t) => !meta.outTypes.includes(t));
    const disabled = invalidInputs.length > 0 || invalidOutputs.length > 0;
    const tooltip = disabled
      ? `Incompatible: ${[
          ...invalidInputs.map((t) => `input:${t}`),
          ...invalidOutputs.map((t) => `output:${t}`),
        ].join(", ")}`
      : "";
    return { disabled, tooltip, meta };
  };

  return (
    <div className="p-3 border-t border-gray-700">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">
        Change Node Type
      </h3>
      <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-1">
        {Object.entries(NodeTypeNodeData).map(([typeKey, typeMeta]) => {
          const nodeType = typeKey as NodeType;
          const { disabled, tooltip, meta } = checkCandidate(nodeType);

          return (
            <button
              key={nodeType}
              onClick={() => !disabled && onSelect(nodeType)}
              className={`flex flex-row items-center gap-2 rounded-md px-2 py-1 border text-sm transition 
                ${
                  disabled
                    ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-100"
                }`}
              title={tooltip}
              disabled={disabled}
            >
              <div
                className="p-1 rounded-md flex items-center justify-center"
                style={{
                  backgroundColor: disabled ? "#4B5563" : typeMeta.bgColor,
                }}
              >
                {typeMeta.icon}
              </div>
              <span className="truncate">{typeMeta.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
