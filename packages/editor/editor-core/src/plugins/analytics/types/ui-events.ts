import { UIAEP } from './events';
import {
  I_ACTION,
  I_ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  I_INPUT_METHOD,
} from './enums';

export const enum PLATFORMS {
  NATIVE = 'mobileNative',
  HYBRID = 'mobileHybrid',
  WEB = 'web',
}

type ButtonAEP<ActionSubjectID, Attributes> = UIAEP<
  I_ACTION['CLICKED'],
  I_ACTION_SUBJECT['BUTTON'],
  ActionSubjectID,
  Attributes
>;

type PickerAEP<ActionSubjectID, Attributes> = UIAEP<
  I_ACTION['OPENED'],
  I_ACTION_SUBJECT['PICKER'],
  ActionSubjectID,
  Attributes
>;

type TypeAheadAEP<ActionSubjectID, Attributes> = UIAEP<
  I_ACTION['INVOKED'],
  I_ACTION_SUBJECT['TYPEAHEAD'],
  ActionSubjectID,
  Attributes
>;

type EditorStartAEP = UIAEP<
  I_ACTION['STARTED'],
  I_ACTION_SUBJECT['EDITOR'],
  undefined,
  { platform: PLATFORMS.NATIVE | PLATFORMS.HYBRID | PLATFORMS.WEB }
>;

type EditorStopAEP = UIAEP<
  I_ACTION['STOPPED'],
  I_ACTION_SUBJECT['EDITOR'],
  ACTION_SUBJECT_ID.SAVE | ACTION_SUBJECT_ID.CANCEL,
  {
    inputMethod: I_INPUT_METHOD['TOOLBAR'] | I_INPUT_METHOD['SHORTCUT'];
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
  I_ACTION['CLICKED'],
  I_ACTION_SUBJECT['MEDIA'],
  ACTION_SUBJECT_ID.ANNOTATE_BUTTON,
  undefined
>;

type ButtonHelpAEP = ButtonAEP<
  ACTION_SUBJECT_ID.BUTTON_HELP,
  { inputMethod: I_INPUT_METHOD['SHORTCUT'] | I_INPUT_METHOD['TOOLBAR'] }
>;

type ButtonFeedbackAEP = ButtonAEP<
  ACTION_SUBJECT_ID.BUTTON_FEEDBACK,
  undefined
>;

type PickerEmojiAEP = PickerAEP<
  ACTION_SUBJECT_ID.PICKER_EMOJI,
  { inputMethod: I_INPUT_METHOD['TOOLBAR'] | I_INPUT_METHOD['INSERT_MENU'] }
>;

type PickerImageAEP = PickerAEP<
  ACTION_SUBJECT_ID.PICKER_CLOUD,
  {
    inputMethod:
      | I_INPUT_METHOD['TOOLBAR']
      | I_INPUT_METHOD['QUICK_INSERT']
      | I_INPUT_METHOD['INSERT_MENU'];
  }
>;

type TypeAheadQuickInsertAEP = TypeAheadAEP<
  ACTION_SUBJECT_ID.TYPEAHEAD_QUICK_INSERT,
  { inputMethod: I_INPUT_METHOD['KEYBOARD'] }
>;

type TypeAheadEmojiAEP = TypeAheadAEP<
  ACTION_SUBJECT_ID.TYPEAHEAD_EMOJI,
  { inputMethod: I_INPUT_METHOD['QUICK_INSERT'] | I_INPUT_METHOD['KEYBOARD'] }
>;

type TypeAheadLinkAEP = TypeAheadAEP<
  ACTION_SUBJECT_ID.TYPEAHEAD_LINK,
  {
    inputMethod:
      | I_INPUT_METHOD['TOOLBAR']
      | I_INPUT_METHOD['INSERT_MENU']
      | I_INPUT_METHOD['QUICK_INSERT']
      | I_INPUT_METHOD['SHORTCUT'];
  }
>;

type TypeAheadMentionAEP = TypeAheadAEP<
  ACTION_SUBJECT_ID.TYPEAHEAD_MENTION,
  {
    inputMethod:
      | I_INPUT_METHOD['TOOLBAR']
      | I_INPUT_METHOD['INSERT_MENU']
      | I_INPUT_METHOD['QUICK_INSERT']
      | I_INPUT_METHOD['KEYBOARD'];
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
