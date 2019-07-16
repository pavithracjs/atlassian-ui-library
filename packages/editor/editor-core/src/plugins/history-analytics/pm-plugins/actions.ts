import { Transaction, EditorState } from 'prosemirror-state';

export enum HistoryAnalyticsActionTypes {
  PUSH = 'PUSH',
  UNDO = 'UNDO',
  REDO = 'REDO',
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

export type HistoryAnalyticsAction = Push | Undo | Redo;
