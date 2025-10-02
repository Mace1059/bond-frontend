import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Edge } from '@xyflow/react';
import { snapshotState, pushHistory } from './historyUtils';


//===========================
// Types
//===========================
interface EdgesState {
  byId: Record<string, Edge>;
  allIds: string[];
  past: Array<{ byId: Record<string, Edge>; allIds: string[] }>;
  future: Array<{ byId: Record<string, Edge>; allIds: string[] }>;
  lastChange: number; // for debouncing
}



const initialState: EdgesState = {
  byId: {},
  allIds: [],
  past: [],
  future: [],
  lastChange: 0,
};

//===========================
// Slice
// Reducers:
// - setEdges
// - addEdge
// - updateEdge
// - deleteEdge
// - undo
// - redo
//===========================
const edgesSlice = createSlice({
  name: 'edges',
  initialState,
  reducers: {
    setEdges(state, action: PayloadAction<Edge[]>) {
      pushHistory(state, () => snapshotState(state));

      // Replace entire state
      state.byId = {};
      state.allIds = [];
      for (const edge of action.payload) {
        state.byId[edge.id] = edge;
        state.allIds.push(edge.id);
      }
    },

    addEdge(state, action: PayloadAction<Edge>) {
      const edge = action.payload;
      if (state.byId[edge.id]) return; // prevent duplicates
      pushHistory(state, () => snapshotState(state));
      state.byId[edge.id] = edge;
      state.allIds.push(edge.id);
    },

    updateEdge(state, action: PayloadAction<Edge>) {
      const edge = action.payload;
      if (!state.byId[edge.id]) return;

      pushHistory(state, () => snapshotState(state));
      state.byId[edge.id] = edge;
    },

    deleteEdge(state, action: PayloadAction<string>){
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
  setEdges,
  updateEdge,
  addEdge,
  deleteEdge,
  undo,
  redo,
} = edgesSlice.actions;
export default edgesSlice.reducer;