import { UIAEP } from './events';
import {
  IAction,
  IActionSubject,
  IActionSubjectId,
  IInputMethod,
} from './enums';
export interface IPlatforms {
  NATIVE: 'mobileNative';
  HYBRID: 'mobileHybrid';
  WEB: 'web';
}

export const PLATFORMS: IPlatforms = {
  NATIVE: 'mobileNative',
  HYBRID: 'mobileHybrid',
  WEB: 'web',
};

type ButtonAEP<ActionSubjectID, Attributes> = UIAEP<
  IAction['CLICKED'],
  IActionSubject['BUTTON'],
  ActionSubjectID,
  Attributes
>;

type PickerAEP<ActionSubjectID, Attributes> = UIAEP<
  IAction['OPENED'],
  IActionSubject['PICKER'],
  ActionSubjectID,
  Attributes
>;

type TypeAheadAEP<ActionSubjectID, Attributes> = UIAEP<
  IAction['INVOKED'],
  IActionSubject['TYPEAHEAD'],
  ActionSubjectID,
  Attributes
>;

type EditorStartAEP = UIAEP<
  IAction['STARTED'],
  IActionSubject['EDITOR'],
  undefined,
  { platform: IPlatforms['NATIVE'] | IPlatforms['HYBRID'] | IPlatforms['WEB'] }
>;

type EditorStopAEP = UIAEP<
  IAction['STOPPED'],
  IActionSubject['EDITOR'],
  IActionSubjectId['SAVE'] | IActionSubjectId['CANCEL'],
  {
    inputMethod: IInputMethod['TOOLBAR'] | IInputMethod['SHORTCUT'];
    documentSize: number;
    nodeCount?: {
      tables: number;
      headings: number;
      lists: number;
      mediaSingles: number;
      mediaGroups: number;
      panels: number;
      extensions: number;
      decisions: number;
      actions: number;
      codeBlocks: number;
    };
  }
>;

type AnnotateButtonAEP = UIAEP<
  IAction['CLICKED'],
  IActionSubject['MEDIA'],
  IActionSubjectId['ANNOTATE_BUTTON'],
  undefined
>;

type ButtonHelpAEP = ButtonAEP<
  IActionSubjectId['BUTTON_HELP'],
  { inputMethod: IInputMethod['SHORTCUT'] | IInputMethod['TOOLBAR'] }
>;

type ButtonFeedbackAEP = ButtonAEP<
  IActionSubjectId['BUTTON_FEEDBACK'],
  undefined
>;

type PickerEmojiAEP = PickerAEP<
  IActionSubjectId['PICKER_EMOJI'],
  { inputMethod: IInputMethod['TOOLBAR'] | IInputMethod['INSERT_MENU'] }
>;

type PickerImageAEP = PickerAEP<
  IActionSubjectId['PICKER_CLOUD'],
  {
    inputMethod:
      | IInputMethod['TOOLBAR']
      | IInputMethod['QUICK_INSERT']
      | IInputMethod['INSERT_MENU'];
  }
>;

type TypeAheadQuickInsertAEP = TypeAheadAEP<
  IActionSubjectId['TYPEAHEAD_QUICK_INSERT'],
  { inputMethod: IInputMethod['KEYBOARD'] }
>;

type TypeAheadEmojiAEP = TypeAheadAEP<
  IActionSubjectId['TYPEAHEAD_EMOJI'],
  { inputMethod: IInputMethod['QUICK_INSERT'] | IInputMethod['KEYBOARD'] }
>;

type TypeAheadLinkAEP = TypeAheadAEP<
  IActionSubjectId['TYPEAHEAD_LINK'],
  {
    inputMethod:
      | IInputMethod['TOOLBAR']
      | IInputMethod['INSERT_MENU']
      | IInputMethod['QUICK_INSERT']
      | IInputMethod['SHORTCUT'];
  }
>;

type TypeAheadMentionAEP = TypeAheadAEP<
  IActionSubjectId['TYPEAHEAD_MENTION'],
  {
    inputMethod:
      | IInputMethod['TOOLBAR']
      | IInputMethod['INSERT_MENU']
      | IInputMethod['QUICK_INSERT']
      | IInputMethod['KEYBOARD'];
  }
>;

export type UIEventPayload =
  | EditorStartAEP
  | EditorStopAEP
  | AnnotateButtonAEP
  | ButtonHelpAEP
  | ButtonFeedbackAEP
  | PickerEmojiAEP
  | PickerImageAEP
  | TypeAheadQuickInsertAEP
  | TypeAheadEmojiAEP
  | TypeAheadLinkAEP
  | TypeAheadMentionAEP;
