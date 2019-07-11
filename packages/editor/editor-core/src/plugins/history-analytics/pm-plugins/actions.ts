import { Transaction } from 'prosemirror-state';
import { AnalyticsEventPayloadWithChannel } from '../../analytics';

export enum HistoryAnalyticsActionTypes {
  PUSH = 'PUSH',
  UNDO = 'UNDO',
  REDO = 'REDO',
}

export interface Push {
  type: HistoryAnalyticsActionTypes.PUSH;
  transactions: Transaction[];
}

export interface Undo {
  type: HistoryAnalyticsActionTypes.UNDO;
}

export interface Redo {
  type: HistoryAnalyticsActionTypes.REDO;
}

export type HistoryAnalyticsAction = Push | Undo | Redo;
