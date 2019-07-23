import { Transaction, EditorState } from 'prosemirror-state';

export enum HistoryAnalyticsActionTypes {
  PUSH = 'HISTORY_ANALYTICS_PUSH',
  UNDO = 'HISTORY_ANALYTICS_UNDO',
  REDO = 'HISTORY_ANALYTICS_REDO',
  SYNC = 'HISTORY_ANALYTICS_SYNC',
}

export interface Push {
  type: HistoryAnalyticsActionTypes.PUSH;
  state: EditorState;
  oldState: EditorState;
  transactions: Transaction[];
}

export interface Undo {
  type: HistoryAnalyticsActionTypes.UNDO;
  transactions: Transaction[];
}

export interface Redo {
  type: HistoryAnalyticsActionTypes.REDO;
  transactions: Transaction[];
}

export interface Sync {
  type: HistoryAnalyticsActionTypes.SYNC;
  state: EditorState;
}

export type HistoryAnalyticsAction = Push | Undo | Redo | Sync;
