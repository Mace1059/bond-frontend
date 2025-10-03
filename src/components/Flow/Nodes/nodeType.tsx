import type { JSX } from "react";
import { NODE_TYPES, OUTPUT_TYPES, type NodeType, type OutputType } from "../../../types/types";
import {
  File,
  FileText,
  Image,
  Video,
  Mic,
  Mail,
  Slack,
  Code2,
  Brain,
  Table,
  Globe,
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

export const NodeTypeNodeData: Record<NodeType, TypeMeta> = {
  [NODE_TYPES.blank]: {
    name: "Blank Node",
    icon: <Menu size={20} />,
    bgColor: "gray-700", // gray-400
    inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio],
    outTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio]
  },

  [NODE_TYPES.ocr]: {
    name: "OCR Node",
    icon: <ClipboardList size={20} />,
    bgColor: "#FBBF24", // amber-400
    inTypes: [OUTPUT_TYPES.pdf, OUTPUT_TYPES.image],
    outTypes: [OUTPUT_TYPES.json]
  },

  [NODE_TYPES.obj]: {
    name: "Object Node",
    icon: <Type size={20} />,
    bgColor: "#A78BFA", // violet-400
    inTypes: [OUTPUT_TYPES.pdf, OUTPUT_TYPES.image],
    outTypes: [OUTPUT_TYPES.json]
  },

  [NODE_TYPES.code]: {
    name: "Code Node",
    icon: <Code2 size={20} />,
    bgColor: "#3B82F6", // blue-500
    inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio],
    outTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio]
  },

  [NODE_TYPES.logic]: {
    name: "Logic Node",
    icon: <Brain size={20} />,
    bgColor: "#8B5CF6", // violet-500
    inTypes: [OUTPUT_TYPES.json],
    outTypes: [OUTPUT_TYPES.json]
  },

  [NODE_TYPES.spreadsheet]: {
    name: "Spreadsheet Node",
    icon: <Table size={20} />,
    bgColor: "#10B981", // emerald-500
    inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.dataframe],
    outTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe]
  },

  [NODE_TYPES.document]: {
    name: "Document Node",
    icon: <FileText size={20} />,
    bgColor: "#6B7280", // gray-500
    inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio],
    outTypes: [OUTPUT_TYPES.json]    
  },

  [NODE_TYPES.image]: {
    name: "Image Node",
    icon: <Image size={20} />,
    bgColor: "#F59E0B", // amber-500
    inTypes: [OUTPUT_TYPES.image],
    outTypes: [OUTPUT_TYPES.image]
  },

  [NODE_TYPES.video]: {
    name: "Video Node",
    icon: <Video size={20} />,
    bgColor: "#EF4444", // red-500
    inTypes: [OUTPUT_TYPES.video],
    outTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.image, OUTPUT_TYPES.video, OUTPUT_TYPES.audio]
  },

  [NODE_TYPES.audio]: {
    name: "Audio Node",
    icon: <Mic size={20} />,
    bgColor: "#3B82F6", // blue-500
    inTypes: [OUTPUT_TYPES.audio],
    outTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.video, OUTPUT_TYPES.audio]
  },

  [NODE_TYPES.email]: {
    name: "Email Node",
    icon: <Mail size={20} />,
    bgColor: "#6366F1", // indigo-500
    inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio],
    outTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio]
  },

  [NODE_TYPES.slack]: {
    name: "Slack Node",
    icon: <Slack size={20} />,
    bgColor: "#10B981", // emerald-500
    inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio],
    outTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio]
  },

  [NODE_TYPES.scraper]: {
    name: "Scraper Node",
    icon: <Search size={20} />,
    bgColor: "#F97316", // orange-500
    inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio],
    outTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio]
  },

  [NODE_TYPES.rss]: {
    name: "RSS Node",
    icon: <Rss size={20} />,
    bgColor: "#F59E0B", // amber-500
    inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio],
    outTypes: [OUTPUT_TYPES.json]
  },

  [NODE_TYPES.summary]: {
    name: "Summary Node",
    icon: <BookOpenText size={20} />,
    bgColor: "#4B5563", // gray-600
    inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.pdf, OUTPUT_TYPES.image, OUTPUT_TYPES.dataframe, OUTPUT_TYPES.video, OUTPUT_TYPES.audio],
    outTypes: [OUTPUT_TYPES.json]
  },
};




