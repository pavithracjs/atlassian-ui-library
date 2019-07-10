import { Transaction } from 'prosemirror-state';

export enum HistoryAnalyticsActionTypes {
  PUSH = 'PUSH',
  UNDO = 'UNDO',
  REDO = 'REDO',
}

export interface Push {
  type: HistoryAnalyticsActionTypes.PUSH;
  tr: Transaction;
}

export interface Undo {
  type: HistoryAnalyticsActionTypes.UNDO;
}

export interface Redo {
  type: HistoryAnalyticsActionTypes.REDO;
}

export type HistoryAnalyticsAction = Push | Undo | Redo;
