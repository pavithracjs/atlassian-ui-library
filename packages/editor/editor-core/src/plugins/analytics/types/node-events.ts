import { TrackAEP } from './events';
import {
  IActionSubject,
  IInputMethod,
  IAction,
  IActionSubjectId,
} from './enums';

export interface IPanelType {
  INFO: 'info';
  SUCCESS: 'success';
  NOTE: 'note';
  WARNING: 'warning';
  ERROR: 'error';
}

export const PANEL_TYPE: IPanelType = {
  INFO: 'info',
  SUCCESS: 'success',
  NOTE: 'note',
  WARNING: 'warning',
  ERROR: 'error',
};
type ValueOf<T> = T[keyof T];

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
  { newType: ValueOf<IPanelType>; previousType: ValueOf<IPanelType> }
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
