import { TrackAEP } from './events';
import {
  IAction,
  IActionSubject,
  IActionSubjectId,
  IInputMethod,
} from './enums';

export interface IIndentDir {
  INDENT: 'indent';
  OUTDENT: 'outdent';
}

export const INDENT_DIR: IIndentDir = {
  INDENT: 'indent',
  OUTDENT: 'outdent',
};

export interface IIndentType {
  PARAGRAPH: 'paragraph';
  LIST: 'list';
  HEADING: 'heading';
  CODE_BLOCK: 'codeBlock';
}

export const INDENT_TYPE: IIndentType = {
  PARAGRAPH: 'paragraph',
  LIST: 'list',
  HEADING: 'heading',
  CODE_BLOCK: 'codeBlock',
};

type FormatAEP<ActionSubjectID, Attributes> = TrackAEP<
  IAction['FORMATTED'],
  IActionSubject['TEXT'],
  ActionSubjectID,
  Attributes
>;

type FormatBasicAEP = FormatAEP<
  | IActionSubjectId['FORMAT_STRONG']
  | IActionSubjectId['FORMAT_ITALIC']
  | IActionSubjectId['FORMAT_UNDERLINE']
  | IActionSubjectId['FORMAT_CODE']
  | IActionSubjectId['FORMAT_STRIKE'],
  {
    inputMethod:
      | IInputMethod['TOOLBAR']
      | IInputMethod['SHORTCUT']
      | IInputMethod['FORMATTING']
      | IInputMethod['FLOATING_TB'];
  }
>;

type FormatSuperSubAEP = FormatAEP<
  IActionSubjectId['FORMAT_SUPER'] | IActionSubjectId['FORMAT_SUB'],
  {
    inputMethod: IInputMethod['TOOLBAR'];
  }
>;

type FormatIndentationAEP = FormatAEP<
  IActionSubjectId['FORMAT_INDENT'],
  {
    inputMethod: IInputMethod['TOOLBAR'] | IInputMethod['KEYBOARD'];
    direction: IIndentDir['INDENT'] | IIndentDir['OUTDENT'];
    previousIndentationLevel: number;
    newIndentLevel: number;
    indentType:
      | IIndentType['PARAGRAPH']
      | IIndentType['LIST']
      | IIndentType['HEADING']
      | IIndentType['CODE_BLOCK'];
  }
>;

type FormatHeadingAEP = FormatAEP<
  IActionSubjectId['FORMAT_HEADING'],
  {
    inputMethod:
      | IInputMethod['TOOLBAR']
      | IInputMethod['SHORTCUT']
      | IInputMethod['FORMATTING'];
    newHeadingLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  }
>;

type FormatBlockQuoteAEP = FormatAEP<
  IActionSubjectId['FORMAT_BLOCK_QUOTE'],
  {
    inputMethod:
      | IInputMethod['TOOLBAR']
      | IInputMethod['KEYBOARD']
      | IInputMethod['FORMATTING']
      | IInputMethod['QUICK_INSERT'];
  }
>;

type FormatClearAEP = FormatAEP<
  IActionSubjectId['FORMAT_CLEAR'],
  {
    inputMethod: IInputMethod['TOOLBAR'] | IInputMethod['SHORTCUT'];
    formattingCleared: string[];
  }
>;

type FormatColorAEP = FormatAEP<
  IActionSubjectId['FORMAT_COLOR'],
  {
    newColor: string;
    previousColor: string;
  }
>;

type FormatListAEP = FormatAEP<
  | IActionSubjectId['FORMAT_LIST_NUMBER']
  | IActionSubjectId['FORMAT_LIST_BULLET'],
  {
    inputMethod:
      | IInputMethod['TOOLBAR']
      | IInputMethod['KEYBOARD']
      | IInputMethod['FORMATTING']
      | IInputMethod['QUICK_INSERT'];
  }
>;

export type FormatEventPayload =
  | FormatBasicAEP
  | FormatSuperSubAEP
  | FormatIndentationAEP
  | FormatHeadingAEP
  | FormatBlockQuoteAEP
  | FormatClearAEP
  | FormatColorAEP
  | FormatListAEP;
