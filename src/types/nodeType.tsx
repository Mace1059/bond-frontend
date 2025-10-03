import type { JSX } from "react";
import { NODE_TYPES, type NodeType, type OutputType } from "./types";
import { ToolTypeData } from "./toolType";

import {
  FileText,
  Image,
  Video,
  Mic,
  Mail,
  Slack,
  Code2,
  Brain,
  Table,
  Rss,
  Menu,
  Type,
  Search,
  ClipboardList,
  BookOpenText,
} from "lucide-react";

interface TypeMeta {
  name: string;
  icon: JSX.Element;
  bgColor: string;
  inTypes: OutputType[];
  outTypes: OutputType[];
}

// Helper function to union all tool input/output types per node
function collectTypesForNode(nodeType: NodeType): {
  inTypes: OutputType[];
  outTypes: OutputType[];
} {
  const inSet = new Set<OutputType>();
  const outSet = new Set<OutputType>();

  const toolsForNode = ToolTypeData[nodeType];
  if (!toolsForNode) return { inTypes: [], outTypes: [] };

  for (const toolMeta of Object.values(toolsForNode)) {
    if (!toolMeta) continue;
    toolMeta.inTypes.forEach((t) => inSet.add(t));
    toolMeta.outTypes.forEach((t) => outSet.add(t));
  }

  return {
    inTypes: Array.from(inSet),
    outTypes: Array.from(outSet),
  };
}

export const NodeTypeNodeData: Record<NodeType, TypeMeta> = {
  [NODE_TYPES.blank]: {
    name: "Blank Node",
    icon: <Menu size={20} />,
    bgColor: "gray-700",
    ...collectTypesForNode(NODE_TYPES.blank),
  },
  [NODE_TYPES.ocr]: {
    name: "OCR Node",
    icon: <ClipboardList size={20} />,
    bgColor: "amber-400",
    ...collectTypesForNode(NODE_TYPES.ocr),
  },
  [NODE_TYPES.obj]: {
    name: "Object Node",
    icon: <Type size={20} />,
    bgColor: "violet-400",
    ...collectTypesForNode(NODE_TYPES.obj),
  },
  [NODE_TYPES.code]: {
    name: "Code Node",
    icon: <Code2 size={20} />,
    bgColor: "blue-500",
    ...collectTypesForNode(NODE_TYPES.code),
  },
  [NODE_TYPES.logic]: {
    name: "Logic Node",
    icon: <Brain size={20} />,
    bgColor: "violet-500",
    ...collectTypesForNode(NODE_TYPES.logic),
  },
  [NODE_TYPES.spreadsheet]: {
    name: "Spreadsheet Node",
    icon: <Table size={20} />,
    bgColor: "emerald-500",
    ...collectTypesForNode(NODE_TYPES.spreadsheet),
  },
  [NODE_TYPES.document]: {
    name: "Document Node",
    icon: <FileText size={20} />,
    bgColor: "gray-500",
    ...collectTypesForNode(NODE_TYPES.document),
  },
  [NODE_TYPES.image]: {
    name: "Image Node",
    icon: <Image size={20} />,
    bgColor: "amber-500",
    ...collectTypesForNode(NODE_TYPES.image),
  },
  [NODE_TYPES.video]: {
    name: "Video Node",
    icon: <Video size={20} />,
    bgColor: "red-500",
    ...collectTypesForNode(NODE_TYPES.video),
  },
  [NODE_TYPES.audio]: {
    name: "Audio Node",
    icon: <Mic size={20} />,
    bgColor: "blue-500",
    ...collectTypesForNode(NODE_TYPES.audio),
  },
  [NODE_TYPES.email]: {
    name: "Email Node",
    icon: <Mail size={20} />,
    bgColor: "indigo-500",
    ...collectTypesForNode(NODE_TYPES.email),
  },
  [NODE_TYPES.slack]: {
    name: "Slack Node",
    icon: <Slack size={20} />,
    bgColor: "emerald-500",
    ...collectTypesForNode(NODE_TYPES.slack),
  },
  [NODE_TYPES.scraper]: {
    name: "Scraper Node",
    icon: <Search size={20} />,
    bgColor: "orange-500",
    ...collectTypesForNode(NODE_TYPES.scraper),
  },
  [NODE_TYPES.rss]: {
    name: "RSS Node",
    icon: <Rss size={20} />,
    bgColor: "amber-500",
    ...collectTypesForNode(NODE_TYPES.rss),
  },
  [NODE_TYPES.summary]: {
    name: "Summary Node",
    icon: <BookOpenText size={20} />,
    bgColor: "gray-600",
    ...collectTypesForNode(NODE_TYPES.summary),
  },
};
