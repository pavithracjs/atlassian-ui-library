import { TrackAEP } from './events';
import { ACTION_SUBJECT, INPUT_METHOD, ACTION } from './enums';

export const enum PANEL_TYPE {
  INFO = 'info',
  SUCCESS = 'success',
  NOTE = 'note',
  WARNING = 'warning',
  ERROR = 'error',
}

type DeletePanelAEP = TrackAEP<
  ACTION.DELETED,
  ACTION_SUBJECT.PANEL,
  undefined,
  { inputMethod: INPUT_METHOD.TOOLBAR }
>;

type ChangePanelAEP = TrackAEP<
  ACTION.CHANGED_TYPE,
  ACTION_SUBJECT.PANEL,
  undefined,
  { newType: PANEL_TYPE; previousType: PANEL_TYPE }
>;

export const enum LINK_TYPE {
  TEXT = 'text',
  INLINE_CARD = 'inlineCard',
  BLOCK_CARD = 'blockCard',
}

type DeleteLinkAEP = TrackAEP<
  ACTION.DELETED,
  ACTION_SUBJECT.LINK,
  undefined,
  { inputMethod: INPUT_METHOD.TOOLBAR; displayMode: LINK_TYPE }
>;

type VisitedLinkAEP = TrackAEP<
  ACTION.VISITED,
  ACTION_SUBJECT.LINK,
  LINK_TYPE,
  LINK_TYPE
>;

export type NodeEventPayload =
  | DeletePanelAEP
  | ChangePanelAEP
  | DeleteLinkAEP
  | VisitedLinkAEP;
