import React from "react";
import type { FlowNode } from "../../../types/types";
import { NODE_TYPES } from "../../../types/types";
import { NodeTypeNodeData } from "../../../types/nodeType";
import { NodeTypeSelector } from "./NodeTypeSelector";

interface NodeDetailProps {
  selectedNode: FlowNode | null;
}

const NodeDetail: React.FC<NodeDetailProps> = ({ selectedNode }) => {
  if (!selectedNode) {
    return (
      <div className="text-sm text-gray-500 italic p-4">
        No node selected.
      </div>
    );
  }

  const nodeType = selectedNode.data?.nodeType;
  if (!nodeType) {
    return (
      <div className="text-sm text-gray-500 italic p-4">
        Unknown node type.
      </div>
    );
  }

  const meta = NodeTypeNodeData[nodeType];

  // Helper: shared icon display
  const renderNodeIcon = (label: string) => (
    <div className="flex flex-col items-center p-6">
      <div
        className="p-4 rounded-2xl flex items-center justify-center shadow-md"
        style={{ backgroundColor: meta.bgColor }}
      >
        {meta.icon}
      </div>
      <div className="mt-3 text-sm text-gray-300 font-medium">{label}</div>
    </div>
  );

  switch (nodeType) {
    case NODE_TYPES.blank:
      return (
        <>
          <NodeTypeSelector
            currentNode={selectedNode as FlowNode}
          />
        </>   
      )

    case NODE_TYPES.ocr:
      return renderNodeIcon("OCR Node");

    case NODE_TYPES.obj:
      return renderNodeIcon("Object Node");

    case NODE_TYPES.code:
      return renderNodeIcon("Code Node");

    case NODE_TYPES.logic:
      return renderNodeIcon("Logic Node");

    case NODE_TYPES.spreadsheet:
      return renderNodeIcon("Spreadsheet Node");

    case NODE_TYPES.document:
      return renderNodeIcon("Document Node");

    case NODE_TYPES.image:
      return renderNodeIcon("Image Node");

    case NODE_TYPES.video:
      return renderNodeIcon("Video Node");

    case NODE_TYPES.audio:
      return renderNodeIcon("Audio Node");

    case NODE_TYPES.email:
      return renderNodeIcon("Email Node");

    case NODE_TYPES.slack:
      return renderNodeIcon("Slack Node");

    case NODE_TYPES.scraper:
      return renderNodeIcon("Scraper Node");

    case NODE_TYPES.rss:
      return renderNodeIcon("RSS Node");

    case NODE_TYPES.summary:
      return renderNodeIcon("Summary Node");

    default:
      return renderNodeIcon(meta.name);
  }
};

export default NodeDetail;
