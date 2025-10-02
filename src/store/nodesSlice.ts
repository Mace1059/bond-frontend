import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Node } from '@xyflow/react';
import { snapshotState, pushHistory } from './historyUtils';


//===========================
// Types
//===========================
interface NodesState {
  byId: Record<string, Node>;
  allIds: string[];
  past: Array<{ byId: Record<string, Node>; allIds: string[] }>;
  future: Array<{ byId: Record<string, Node>; allIds: string[] }>;
  lastChange: number; // for debouncing
}


const initialState: NodesState = {
  byId: {},
  allIds: [],
  past: [],
  future: [],
  lastChange: 0,
};


//===========================
// Slice
// Reducers:
// - setNodes
// - addNode
// - updateNode
// - deleteNode
// - undo
// - redo
//===========================
const nodesSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    setNodes(state, action: PayloadAction<Node[]>) {
      pushHistory(state, () => snapshotState(state));

      // Replace entire state
      state.byId = {};
      state.allIds = [];
      for (const node of action.payload) {
        state.byId[node.id] = node;
        state.allIds.push(node.id);
      }
    },

    addNode(state, action: PayloadAction<Node>) {
      const node = action.payload;
      pushHistory(state, () => snapshotState(state));
      state.byId[node.id] = node;
      state.allIds.push(node.id);
    },

    updateNode(state, action: PayloadAction<Node>) {
      const node = action.payload;
      if (!state.byId[node.id]) return;

      pushHistory(state, () => snapshotState(state));
      state.byId[node.id] = node;
    },

    deleteNode(state, action: PayloadAction<string>){
      const id = action.payload;
      if (!state.byId[id]) return;
      pushHistory(state, () => snapshotState(state));
      delete state.byId[id];
      state.allIds = state.allIds.filter(nid => nid !== id)
    },

    undo: (state) => {
      if (state.past.length === 0) return;
      const previous = state.past.pop()!;
      state.future.push(snapshotState(state));
      state.byId = previous.byId;
      state.allIds = previous.allIds;
    },

    redo: (state) => {
      if (state.future.length === 0) return;
      const next = state.future.pop()!;
      state.past.push(snapshotState(state));
      state.byId = next.byId;
      state.allIds = next.allIds;
    },
  },
});


export const {
  setNodes,
  updateNode,
  addNode,
  deleteNode,
  undo,
  redo,
} = nodesSlice.actions;
export default nodesSlice.reducer;