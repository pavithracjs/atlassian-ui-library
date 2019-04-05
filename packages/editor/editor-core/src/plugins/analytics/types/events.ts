import { Dispatch } from '../../../event-dispatcher';
import { IEventType, IActionSubject } from './enums';
import { UIEventPayload } from './ui-events';
import { FormatEventPayload } from './format-events';
import { SubstituteEventPayload } from './substitute-events';
import { InsertEventPayload } from './insert-events';
import { NodeEventPayload } from './node-events';
import { TableEventPayload } from './table-events';
import { PasteEventPayload } from './paste-events';

type AEP<Action, ActionSubject, ActionSubjectID, Attributes, EventType> = {
  action: Action;
  actionSubject: ActionSubject;
  actionSubjectId?: ActionSubjectID;
  attributes?: Attributes;
  eventType: EventType;
};

export type UIAEP<Action, ActionSubject, ActionSubjectID, Attributes> = AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  IEventType['UI']
>;

export type TrackAEP<Action, ActionSubject, ActionSubjectID, Attributes> = AEP<
  Action,
  ActionSubject,
  ActionSubjectID,
  Attributes,
  IEventType['TRACK']
>;

export type TableAEP<Action, Attributes> = TrackAEP<
  Action,
  IActionSubject['TABLE'],
  null,
  Attributes
>;

export type AnalyticsEventPayload =
  | UIEventPayload
  | FormatEventPayload
  | SubstituteEventPayload
  | InsertEventPayload
  | NodeEventPayload
  | TableEventPayload
  | PasteEventPayload;

export type AnalyticsDispatch = Dispatch<{
  payload: AnalyticsEventPayload;
  channel?: string;
}>;
