import { ACTION, ACTION_SUBJECT_ID, ACTION_SUBJECT, EVENT_TYPE } from './enums';
import { TABLE_ACTION } from './table-events';
import {
  AnalyticsEventPayload,
  AnalyticsEventPayloadWithChannel,
} from './events';

export enum HISTORY_ACTION {
  UNDID = 'undid',
}

type UndoAEP = {
  action: HISTORY_ACTION.UNDID;
  // matches the original event
  actionSubject: ACTION_SUBJECT;
  // action of the original event
  actionSubjectId: ACTION | TABLE_ACTION;
  // all attributes from original event + its actionSubjectId
  attributes: {
    [key: string]: any;
    actionSubjectId: ACTION_SUBJECT_ID | undefined | null;
  };
  eventType: EVENT_TYPE.TRACK;
};

export type HistoryEventPayload = UndoAEP;

export type AEPExcludingHistory = Exclude<
  AnalyticsEventPayload,
  HistoryEventPayload
>;

export type AEPExcludingHistoryWithChannel = AnalyticsEventPayloadWithChannel & {
  payload: AEPExcludingHistory;
};
