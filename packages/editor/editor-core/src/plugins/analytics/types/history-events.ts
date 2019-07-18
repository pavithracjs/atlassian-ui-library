import { ACTION, ACTION_SUBJECT_ID, ACTION_SUBJECT, EVENT_TYPE } from './enums';
import { TABLE_ACTION } from './table-events';
import {
  AnalyticsEventPayload,
  AnalyticsEventPayloadWithChannel,
} from './events';

export type AEPExcludingHistory = Exclude<
  AnalyticsEventPayload,
  HistoryEventPayload
>;

export type AEPExcludingHistoryWithChannel = AnalyticsEventPayloadWithChannel & {
  payload: AEPExcludingHistory;
};

type UndoAEP = {
  action: ACTION.UNDID;
  // matches the original event
  actionSubject: ACTION_SUBJECT;
  // action of the original event
  actionSubjectId: Omit<ACTION, 'UNDID'> | TABLE_ACTION;
  // all attributes from original event + its actionSubjectId
  attributes: Pick<AEPExcludingHistory, 'attributes'> & {
    actionSubjectId: ACTION_SUBJECT_ID | undefined | null;
  };
  eventType: EVENT_TYPE.TRACK;
};

export type HistoryEventPayload = UndoAEP;
