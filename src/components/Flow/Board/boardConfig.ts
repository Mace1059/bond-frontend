import {
  type FitViewOptions,
  type NodeTypes,
  type DefaultEdgeOptions,
  type OnNodeDrag,

  MarkerType,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import testNode from '../Nodes/testNode';
 
//===========================
// Node Types
//===========================
export const flowNodeTypes: NodeTypes = {
  blank: testNode,
};


//===========================
// Behaviors
//===========================

// Grid width/height to snap to
export const snapGrid: [number, number] = [5, 5];

// Unsure...
export const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

// Describes how edges are shaped/tipped/colored
export const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',

  markerEnd: {
    width: 20,
    height: 20,
    type: MarkerType.ArrowClosed,
    color: "black",
  },

  style: {
    strokeWidth: 1,
    stroke: "black",
  },
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  return node;
};

//===========================
// Helper Functions
//===========================
export const getId = () => uuidv4();
