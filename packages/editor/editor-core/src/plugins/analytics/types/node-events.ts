import { TrackAEP } from './events';
import {
  IActionSubject,
  IInputMethod,
  IAction,
  IActionSubjectId,
} from './enums';

export const enum PANEL_TYPE {
  INFO = 'info',
  SUCCESS = 'success',
  NOTE = 'note',
  WARNING = 'warning',
  ERROR = 'error',
}

type DeletePanelAEP = TrackAEP<
  IAction['DELETED'],
  IActionSubject['PANEL'],
  undefined,
  { inputMethod: IInputMethod['TOOLBAR'] }
>;

type ChangePanelAEP = TrackAEP<
  IAction['CHANGED_TYPE'],
  IActionSubject['PANEL'],
  undefined,
  { newType: PANEL_TYPE; previousType: PANEL_TYPE }
>;

type VisitedSmartLink = TrackAEP<
  IAction['VISITED'],
  IActionSubject['SMART_LINK'],
  IActionSubjectId['CARD_BLOCK'] | IActionSubjectId['CARD_INLINE'],
  { inputMethod: IInputMethod['TOOLBAR'] | IInputMethod['CARD'] }
>;

type DeletedSmartLink = TrackAEP<
  IAction['DELETED'],
  IActionSubject['SMART_LINK'],
  IActionSubjectId['CARD_BLOCK'] | IActionSubjectId['CARD_INLINE'],
  {
    inputMethod: IInputMethod['TOOLBAR'] | IInputMethod['CARD'];
    displayMode:
      | IActionSubjectId['CARD_BLOCK']
      | IActionSubjectId['CARD_INLINE'];
  }
>;

export type NodeEventPayload =
  | ChangePanelAEP
  | DeletePanelAEP
  | DeletedSmartLink
  | VisitedSmartLink;
