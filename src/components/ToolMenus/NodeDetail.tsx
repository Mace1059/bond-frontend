import React from "react";
import type { FlowNode } from "../../types/types";
import { NODE_TYPES } from "../../types/types";
import { NodeTypeNodeData } from "../../types/nodeType";
import { NodeTypeSelector } from "../Flow/RightSidebar/NodeTypeSelector";
import { TOOL_TYPE } from "../../types/toolType";
import RSSFetch from "./ToolRSS/RSSFetch";
import CodeEditor from "../CodeEditor/CodeEditor";

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

  if (nodeType == NODE_TYPES.blank) {
    return (
      <NodeTypeSelector
        currentNode={selectedNode as FlowNode}
      />
    )
  }

  else {
    const toolType = selectedNode.data?.toolType;

    switch (toolType) {
      // 📝 OCR
      case TOOL_TYPE.ocr_image:
      case TOOL_TYPE.ocr_pdf:
        return <div />;

      // 🧠 Object detection
      case TOOL_TYPE.obj_image:
      case TOOL_TYPE.obj_video:
        return <div />;

      // 💻 Code
      case TOOL_TYPE.code_python:
      case TOOL_TYPE.code_sql:
      case TOOL_TYPE.code_r:
      case TOOL_TYPE.code_javascript:
      case TOOL_TYPE.code_shell:
      case TOOL_TYPE.code_java:
      case TOOL_TYPE.code_c:
      case TOOL_TYPE.code_cpp:
      case TOOL_TYPE.code_csharp:
      case TOOL_TYPE.code_go:
      case TOOL_TYPE.code_ruby:
      case TOOL_TYPE.code_php:
      case TOOL_TYPE.code_typescript:
      case TOOL_TYPE.code_swift:
        return <CodeEditor />;

      // 🧭 Logic
      case TOOL_TYPE.logic_if:
      case TOOL_TYPE.logic_loop:
      case TOOL_TYPE.logic_switch:
        return <div />;

      // 🧾 Spreadsheet
      case TOOL_TYPE.spreadsheet_read:
      case TOOL_TYPE.spreadsheet_write:
      case TOOL_TYPE.spreadsheet_clean:
        return <div />;

      // 📄 Document
      case TOOL_TYPE.document_merge:
      case TOOL_TYPE.document_split:
      case TOOL_TYPE.document_convert:
        return <div />;

      // 🖼 Image
      case TOOL_TYPE.image_resize:
      case TOOL_TYPE.image_compress:
      case TOOL_TYPE.image_convert:
      case TOOL_TYPE.image_generate:
        return <div />;

      // 🎥 Video
      case TOOL_TYPE.video_trim:
      case TOOL_TYPE.video_compress:
      case TOOL_TYPE.video_convert:
        return <div />;

      // 🎧 Audio
      case TOOL_TYPE.audio_trim:
      case TOOL_TYPE.audio_compress:
      case TOOL_TYPE.audio_convert:
        return <div />;

      // 📬 Email
      case TOOL_TYPE.email_read:
      case TOOL_TYPE.email_write:
        return <div />;

      // 💬 Slack
      case TOOL_TYPE.slack_read:
      case TOOL_TYPE.slack_write:
        return <div />;

      // 🌐 Scraper
      case TOOL_TYPE.web_scraper:
        return <div />;

      // 📰 RSS
      case TOOL_TYPE.rss_fetch:
        return <RSSFetch selectedNode={selectedNode} />;

      // 📝 Summary
      case TOOL_TYPE.text_summarize:
        return <div />;

      default:
        return (
          <div className="text-sm text-gray-500 italic p-4">
            Unknown tool type.
          </div>
        );
    }
  }



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
