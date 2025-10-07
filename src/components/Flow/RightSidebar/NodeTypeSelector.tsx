import React, { useMemo, useState } from "react";
import { NodeTypeNodeData } from "../../../types/nodeType";
import { ToolTypeData, type ToolType } from "../../../types/toolType";
import type { FlowNode, NodeType, OutputType } from "../../../types/types";
import { useReactFlow } from "@xyflow/react";
import { useUpdateNodeData } from "../../../hooks/useUpdateNodeData";

interface NodeTypeSelectorProps {
  currentNode: FlowNode | null;
}

export const NodeTypeSelector: React.FC<NodeTypeSelectorProps> = ({ currentNode }) => {
  const rf = useReactFlow();
  const updateNodeData = useUpdateNodeData();


  // 👇 Step navigation: either picking node type or picking tool
  const [selectedNodeType, setSelectedNodeType] = useState<NodeType | null>(null);

  // Get input/output types of connected nodes
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

  // ========================
  // STEP 1: Pick Node Type
  // ========================
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


  const handleNodeTypeSelect = (newType: NodeType) => {
    setSelectedNodeType(newType);
  };

  const renderNodeTypeSelection = () => (
    <div className="p-3 border-t border-gray-700">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">Change Node Type</h3>
      <div className="grid grid-cols-1 overflow-y-auto pr-1">
        {Object.entries(NodeTypeNodeData).map(([typeKey, typeMeta]) => {
          const nodeType = typeKey as NodeType;
          const { disabled, tooltip } = checkCandidate(nodeType);

          return (
            <button
              key={nodeType}
              onClick={() => !disabled && handleNodeTypeSelect(nodeType)}
              className={`flex flex-row items-center gap-4 px-2 py-1 border h-15 text-sm transition 
                ${disabled
                  ? "border-gray-700 text-gray-500 cursor-not-allowed"
                  : "hover:bg-gray-600 border-gray-600 text-gray-100"
                }`}
              title={tooltip}
              disabled={disabled}
            >
              <div
                className={`p-1 rounded-md flex items-center justify-center bg-${typeMeta.bgColor}`}
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

  // ========================
  // STEP 2: Pick Tool
  // ========================
  const checkToolCandidate = (toolKey: ToolType) => {
    if (!selectedNodeType) return { disabled: true, tooltip: "No node type selected" };

    const toolMeta = ToolTypeData[selectedNodeType]?.[toolKey];
    if (!toolMeta) return { disabled: true, tooltip: "Tool not found" };

    // Check if all inputTypes are compatible with the tool's accepted inTypes
    const invalidInputs = inputTypes.filter((t) => !toolMeta.inTypes.includes(t));
    const disabled = invalidInputs.length > 0;
    const tooltip = disabled
      ? `Incompatible inputs: ${invalidInputs.join(", ")}`
      : "";

    return { disabled, tooltip };
  };

  const handleToolSelect = (toolKey: ToolType) => {
    if (!selectedNodeType || !currentNode) return;

    const freshNode = rf.getNode(currentNode.id) as FlowNode | undefined;
    if (!freshNode) return;

    const toolMeta = ToolTypeData[selectedNodeType]?.[toolKey];
    updateNodeData(currentNode.id, {
      nodeType: selectedNodeType,
      toolType: toolKey,
      outputType: toolMeta && toolMeta.outTypes[0],
    });

    setSelectedNodeType(null); // reset view
  };

  const renderToolSelection = () => {
    if (!selectedNodeType) return null;

    const tools = ToolTypeData[selectedNodeType] || {};

    return (
      <div className="p-3 border-t border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-300">
            Select a Tool for <span className="capitalize">{selectedNodeType}</span>
          </h3>
          <button
            onClick={() => setSelectedNodeType(null)}
            className="text-xs text-gray-400 hover:text-white underline"
          >
            ← Back
          </button>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
          {Object.entries(tools).map(([toolKey, toolMeta]) => {
            const { disabled, tooltip } = checkToolCandidate(toolKey as ToolType);

            return (
              <button
                key={toolKey}
                onClick={() => !disabled && handleToolSelect(toolKey as ToolType)}
                className={`flex flex-col items-start text-left p-2 border rounded-md transition ${disabled
                  ? "border-gray-700 text-gray-500 cursor-not-allowed bg-gray-800/50"
                  : "border-gray-600 hover:bg-gray-700 text-gray-100"
                  }`}
                title={tooltip}
                disabled={disabled}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`p-1 rounded-md ${disabled ? "bg-gray-700" : "bg-gray-800"}`}>
                    <toolMeta.icon size={18} className={`${disabled ? "text-gray-500" : "text-gray-200"}`} />
                  </div>
                  <span className="text-sm font-medium truncate">{toolKey}</span>
                </div>
                <p className={`text-xs ${disabled ? "text-gray-500" : "text-gray-400"}`}>
                  {toolMeta.description}
                </p>
              </button>
            );
          })}

        </div>
      </div>
    );
  };

  return selectedNodeType ? renderToolSelection() : renderNodeTypeSelection();
};
