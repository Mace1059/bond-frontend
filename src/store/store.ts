import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from './nodesSlice';
import edgesReducer from './edgesSlice';
import flowsReducer from './flowsSlice';  

export const store = configureStore({
  reducer:{
    nodes: nodesReducer,
    edges: edgesReducer,
    flows: flowsReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store