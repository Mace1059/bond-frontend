import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import undoable, { includeAction } from 'redux-undo';


//===========================
// Types
//===========================
export interface Flow{
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface FlowState{
  byId: Record<string, Flow>;
  allIds: string[];
  activeFlowId: string | null;
}

const initialState: FlowState = {
  byId: {},
  allIds: [],
  activeFlowId: null,
}


//===========================
// Slice
// Reducers:
// - setFlows
// - addFlow
// - updateFlow
// - deleteFlow
// - setActiveFlow
//===========================
const flowSlice = createSlice({
  name: 'flows',
  initialState,
  reducers: {
    setFlows(state, action: PayloadAction<Flow[]>) {
      state.byId = {};
      state.allIds = [];
      for (const flow of action.payload) {
        state.byId[flow.id] = flow;
        state.allIds.push(flow.id);
      }
    },

    addFlow(state, action: PayloadAction<Flow>) {
      const flow = action.payload;
      state.byId[flow.id] = flow;
      state.allIds.push(flow.id);
    },

    updateFlow(state, action: PayloadAction<Partial<Flow> & { id: string }>) {
      const { id, ...updates } = action.payload;
      if (state.byId[id]) {
        state.byId[id] = {
          ...state.byId[id],
          ...updates,
          updated_at: new Date().toISOString(),
        };
      }
    },

    deleteFlow(state, action: PayloadAction<string>) {
      const id = action.payload;
      delete state.byId[id];
      state.allIds = state.allIds.filter(fid => fid !== id);
      if (state.activeFlowId === id) {
        state.activeFlowId = null;
      }
    },

    setActiveFlow(state, action: PayloadAction<string | null>) {
      state.activeFlowId = action.payload;
    },
  },
});


export const { setFlows, addFlow, updateFlow, deleteFlow, setActiveFlow } = flowSlice.actions;
export default undoable(flowSlice.reducer, {
  limit: 50, // keep last 50 actions
  filter: includeAction([addFlow.type, updateFlow.type, deleteFlow.type]),
});