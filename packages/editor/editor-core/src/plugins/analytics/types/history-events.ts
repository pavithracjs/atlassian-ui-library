import { ACTION, ACTION_SUBJECT_ID, EVENT_TYPE } from './enums';
import { ACTION_SUBJECT } from '@atlaskit/renderer/src/analytics/enums';
import { Attributes } from 'react';

type UndoAEP = {
  action: ACTION.UNDID;
  // matches the original event
  actionSubject: ACTION_SUBJECT;
  // action of the original event
  actionSubjectId: ACTION;
  // all attributes from original event + actionSubject/actionSubjectId
  attributes: Attributes & {
    actionSubject: ACTION_SUBJECT; //todo: this is in 2 places
    actionSubjectId?: ACTION_SUBJECT_ID;
  };
  eventType: EVENT_TYPE.TRACK;
};

export type HistoryEventPayload = UndoAEP;
