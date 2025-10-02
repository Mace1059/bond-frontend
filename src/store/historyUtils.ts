// src/store/historyUtils.ts
interface HistoryState<T> {
  byId: Record<string, T>;
  allIds: string[];
  past: Array<{ byId: Record<string, T>; allIds: string[] }>;
  future: Array<{ byId: Record<string, T>; allIds: string[] }>;
  lastChange: number;
}

const HISTORY_LIMIT = 50;
const DEBOUNCE_MS = 300;

/**
 * ✅ Snapshot the current state using JSON serialization (safe for React Flow)
 */
export function snapshotState<T>(state: HistoryState<T>) {
  return {
    byId: JSON.parse(JSON.stringify(state.byId)),
    allIds: [...state.allIds],
  };
}

/**
 * ✅ Push current snapshot to history if debounce time passed
 */
export function pushHistory<T>(state: HistoryState<T>, snapshotFn: () => { byId: Record<string, T>; allIds: string[] }) {
  const now = Date.now();
  if (now - state.lastChange < DEBOUNCE_MS) return;

  state.past.push(snapshotFn());
  if (state.past.length > HISTORY_LIMIT) {
    state.past.shift(); // remove oldest
  }
  state.future = []; // clear redo stack
  state.lastChange = now;
}
