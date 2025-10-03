import type { JSX } from "react";
import { type NodeType, type OutputType, NODE_TYPES, OUTPUT_TYPES } from "./types";
import { ClipboardList, Search, Video, Code2, Database, Sigma, FileCode, Terminal, GitBranch, Repeat, SwitchCamera, Table, Eraser, FilePlus, FileMinus, FileText, ImageIcon, ImageMinus, Sparkles, Scissors, Film, Music, Mail, Slack, Rss, BookOpenText } from "lucide-react";

interface ToolTypeMeta {
  nodeType: NodeType;
  description: string;
  icon: JSX.Element;
  inTypes: OutputType[];
  outTypes: OutputType[];
}

export const TOOL_TYPE = {
  // blank: 'blank',
  // ocr: 'ocr',
  ocr_image: 'ocr_image',
  ocr_pdf: 'ocr_pdf',
  // obj: 'obj',
  obj_image: 'obj_image',
  obj_video: 'obj_video',
  // code: 'code',
  code_python: 'code_python',
  code_sql: 'code_sql',
  code_r: 'code_r',
  code_javascript: 'code_javascript',
  code_shell: 'code_shell',
  code_java: 'code_java',
  code_c: 'code_c',
  code_cpp: 'code_cpp',
  code_csharp: 'code_csharp',
  code_go: 'code_go',
  code_ruby: 'code_ruby',
  code_php: 'code_php',
  code_typescript: 'code_typescript',
  code_swift: 'code_swift',
  // logic: 'logic',
  logic_if: 'logic_if',
  logic_loop: 'logic_loop',
  logic_switch: 'logic_switch',
  // spreadsheet: 'spreadsheet',
  spreadsheet_read: 'spreadsheet_read',
  spreadsheet_write: 'spreadsheet_write',
  spreadsheet_clean: 'spreadsheet_clean',
  // document: 'document',
  document_merge: 'document_merge',
  document_split: 'document_split',
  document_convert: 'document_convert',
  // image: 'image',
  image_resize: 'image_resize',
  image_compress: 'image_compress',
  image_convert: 'image_convert',
  image_generate: 'image_generate',  
  // video: 'video',
  video_trim: 'video_trim',
  video_compress: 'video_compress',
  video_convert: 'video_convert',
  // audio: 'audio',
  audio_trim: 'audio_trim',
  audio_compress: 'audio_compress',
  audio_convert: 'audio_convert', 
  // email: 'email',
  email_read: 'email_read',
  email_write: 'email_write',
  // slack: 'slack',
  slack_read: 'slack_read',
  slack_write: 'slack_write',
  // scraper: 'scraper',
  web_scraper: 'web_scraper',
  // rss: 'rss',
  rss_fetch: 'rss_fetch',
  // summary: 'summary',
  text_summarize: 'text_summarize',
} as const;

export type ToolType = typeof TOOL_TYPE[keyof typeof TOOL_TYPE];


export const ToolTypeData: Record<NodeType, Partial<Record<ToolType, ToolTypeMeta>>> = {
  [NODE_TYPES.ocr]: {
    ocr_image: {
      nodeType: NODE_TYPES.ocr,
      description: "Extract text from images",
      icon: <ClipboardList size={18} />,
      inTypes: [OUTPUT_TYPES.image],
      outTypes: [OUTPUT_TYPES.json],
    },
    ocr_pdf: {
      nodeType: NODE_TYPES.ocr,
      description: "Extract text from PDFs",
      icon: <ClipboardList size={18} />,
      inTypes: [OUTPUT_TYPES.pdf],
      outTypes: [OUTPUT_TYPES.json],
    },
  },

  [NODE_TYPES.obj]: {
    obj_image: {
      nodeType: NODE_TYPES.obj,
      description: "Detect objects in images",
      icon: <Search size={18} />,
      inTypes: [OUTPUT_TYPES.image],
      outTypes: [OUTPUT_TYPES.json],
    },
    obj_video: {
      nodeType: NODE_TYPES.obj,
      description: "Detect objects in video",
      icon: <Video size={18} />,
      inTypes: [OUTPUT_TYPES.video],
      outTypes: [OUTPUT_TYPES.json],
    },
  },

  [NODE_TYPES.code]: {
    code_python: {
      nodeType: NODE_TYPES.code,
      description: "Execute Python scripts",
      icon: <Code2 size={18} />,
      inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.dataframe],
      outTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.dataframe],
    },
    code_sql: {
      nodeType: NODE_TYPES.code,
      description: "Run SQL queries",
      icon: <Database size={18} />,
      inTypes: [OUTPUT_TYPES.dataframe],
      outTypes: [OUTPUT_TYPES.dataframe],
    },
    code_r: {
      nodeType: NODE_TYPES.code,
      description: "Run R scripts",
      icon: <Sigma size={18} />,
      inTypes: [OUTPUT_TYPES.dataframe],
      outTypes: [OUTPUT_TYPES.dataframe],
    },
    code_javascript: {
      nodeType: NODE_TYPES.code,
      description: "Execute JavaScript",
      icon: <FileCode size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
    code_shell: {
      nodeType: NODE_TYPES.code,
      description: "Run shell commands",
      icon: <Terminal size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
    // ...other code tools
  },

  [NODE_TYPES.logic]: {
    logic_if: {
      nodeType: NODE_TYPES.logic,
      description: "Branch flow by conditions",
      icon: <GitBranch size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
    logic_loop: {
      nodeType: NODE_TYPES.logic,
      description: "Iterate over lists",
      icon: <Repeat size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
    logic_switch: {
      nodeType: NODE_TYPES.logic,
      description: "Switch between paths",
      icon: <SwitchCamera size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
  },

  [NODE_TYPES.spreadsheet]: {
    spreadsheet_read: {
      nodeType: NODE_TYPES.spreadsheet,
      description: "Read spreadsheet data",
      icon: <Table size={18} />,
      inTypes: [OUTPUT_TYPES.json, OUTPUT_TYPES.dataframe],
      outTypes: [OUTPUT_TYPES.dataframe],
    },
    spreadsheet_write: {
      nodeType: NODE_TYPES.spreadsheet,
      description: "Write spreadsheet data",
      icon: <Table size={18} />,
      inTypes: [OUTPUT_TYPES.dataframe],
      outTypes: [OUTPUT_TYPES.dataframe],
    },
    spreadsheet_clean: {
      nodeType: NODE_TYPES.spreadsheet,
      description: "Clean spreadsheet data",
      icon: <Eraser size={18} />,
      inTypes: [OUTPUT_TYPES.dataframe],
      outTypes: [OUTPUT_TYPES.dataframe],
    },
  },

  [NODE_TYPES.document]: {
    document_merge: {
      nodeType: NODE_TYPES.document,
      description: "Merge multiple documents",
      icon: <FilePlus size={18} />,
      inTypes: [OUTPUT_TYPES.pdf, OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.pdf],
    },
    document_split: {
      nodeType: NODE_TYPES.document,
      description: "Split a document",
      icon: <FileMinus size={18} />,
      inTypes: [OUTPUT_TYPES.pdf],
      outTypes: [OUTPUT_TYPES.pdf],
    },
    document_convert: {
      nodeType: NODE_TYPES.document,
      description: "Convert document formats",
      icon: <FileText size={18} />,
      inTypes: [OUTPUT_TYPES.pdf, OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.pdf, OUTPUT_TYPES.json],
    },
  },

  [NODE_TYPES.image]: {
    image_resize: {
      nodeType: NODE_TYPES.image,
      description: "Resize images",
      icon: <ImageIcon size={18} />,
      inTypes: [OUTPUT_TYPES.image],
      outTypes: [OUTPUT_TYPES.image],
    },
    image_compress: {
      nodeType: NODE_TYPES.image,
      description: "Compress images",
      icon: <ImageMinus size={18} />,
      inTypes: [OUTPUT_TYPES.image],
      outTypes: [OUTPUT_TYPES.image],
    },
    image_convert: {
      nodeType: NODE_TYPES.image,
      description: "Convert image format",
      icon: <ImageIcon size={18} />,
      inTypes: [OUTPUT_TYPES.image],
      outTypes: [OUTPUT_TYPES.image],
    },
    image_generate: {
      nodeType: NODE_TYPES.image,
      description: "Generate new images",
      icon: <Sparkles size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.image],
    },
  },

  [NODE_TYPES.video]: {
    video_trim: {
      nodeType: NODE_TYPES.video,
      description: "Trim videos",
      icon: <Scissors size={18} />,
      inTypes: [OUTPUT_TYPES.video],
      outTypes: [OUTPUT_TYPES.video],
    },
    video_compress: {
      nodeType: NODE_TYPES.video,
      description: "Compress videos",
      icon: <Film size={18} />,
      inTypes: [OUTPUT_TYPES.video],
      outTypes: [OUTPUT_TYPES.video],
    },
    video_convert: {
      nodeType: NODE_TYPES.video,
      description: "Convert video formats",
      icon: <Film size={18} />,
      inTypes: [OUTPUT_TYPES.video],
      outTypes: [OUTPUT_TYPES.video],
    },
  },

  [NODE_TYPES.audio]: {
    audio_trim: {
      nodeType: NODE_TYPES.audio,
      description: "Trim audio clips",
      icon: <Music size={18} />,
      inTypes: [OUTPUT_TYPES.audio],
      outTypes: [OUTPUT_TYPES.audio],
    },
    audio_compress: {
      nodeType: NODE_TYPES.audio,
      description: "Compress audio",
      icon: <Music size={18} />,
      inTypes: [OUTPUT_TYPES.audio],
      outTypes: [OUTPUT_TYPES.audio],
    },
    audio_convert: {
      nodeType: NODE_TYPES.audio,
      description: "Convert audio formats",
      icon: <Music size={18} />,
      inTypes: [OUTPUT_TYPES.audio],
      outTypes: [OUTPUT_TYPES.audio],
    },
  },

  [NODE_TYPES.email]: {
    email_read: {
      nodeType: NODE_TYPES.email,
      description: "Read emails",
      icon: <Mail size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
    email_write: {
      nodeType: NODE_TYPES.email,
      description: "Send emails",
      icon: <Mail size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
  },

  [NODE_TYPES.slack]: {
    slack_read: {
      nodeType: NODE_TYPES.slack,
      description: "Read messages from Slack",
      icon: <Slack size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
    slack_write: {
      nodeType: NODE_TYPES.slack,
      description: "Send messages to Slack",
      icon: <Slack size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
  },

  [NODE_TYPES.scraper]: {
    web_scraper: {
      nodeType: NODE_TYPES.scraper,
      description: "Scrape data from the web",
      icon: <Search size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
  },

  [NODE_TYPES.rss]: {
    rss_fetch: {
      nodeType: NODE_TYPES.rss,
      description: "Fetch RSS feeds",
      icon: <Rss size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
  },

  [NODE_TYPES.summary]: {
    text_summarize: {
      nodeType: NODE_TYPES.summary,
      description: "Summarize text",
      icon: <BookOpenText size={18} />,
      inTypes: [OUTPUT_TYPES.json],
      outTypes: [OUTPUT_TYPES.json],
    },
  },

  [NODE_TYPES.blank]: {},
};