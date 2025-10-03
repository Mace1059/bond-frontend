// types.ts
import type { Node } from '@xyflow/react';

export const OUTPUT_TYPES = {
  json: 'json',
  pdf: 'pdf',
  image: 'image',
  dataframe: 'dataframe',
} as const;

export type OutputType = typeof OUTPUT_TYPES[keyof typeof OUTPUT_TYPES];

export const NODE_TYPES = {
  blank: 'blank',
  ocr: 'ocr',
  obj: 'obj',
  code: 'code',
  logic: 'logic',
  spreadsheet: 'spreadsheet',
  document: 'document',
  image: 'image',
  video: 'video',
  audio: 'audio',
  email: 'email',
  slack: 'slack',
  scraper: 'scraper',
  rss: 'rss',
  summary: 'summary',
} as const;

export type NodeType = typeof NODE_TYPES[keyof typeof NODE_TYPES];


export interface FlowNodeData extends Record<string, unknown> {
  name: string;                 // e.g. "Processing Node"
  nodeType: NodeType;                // e.g. "processor"
  outputType: OutputType;      // one of the four
  inputs: Record<string, any>; // data coming in from edges
  outputs: Record<string, any>; // generated results
}

export type FlowNode = Node<FlowNodeData, 'flowNode'>;
