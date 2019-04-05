import { TrackAEP } from './events';
import {
  IAction,
  IActionSubject,
  IActionSubjectId,
  IInputMethod,
} from './enums';

export const PasteTypes: { [type: string]: PasteType } = {
  richText: 'richText',
  plain: 'plain',
  markdown: 'markdown',
  binary: 'binary',
};

export type PasteType = 'richText' | 'plain' | 'markdown' | 'binary';

export const PasteSources: { [type: string]: PasteSource } = {
  fabricEditor: 'fabric-editor',
  applePages: 'apple-pages',
  googleSpreadsheets: 'google-spreadsheets',
  googleDocs: 'google-docs',
  microsoftExcel: 'microsoft-excel',
  microsoftWord: 'microsoft-word',
  dropboxPaper: 'dropbox-paper',
  uncategorized: 'uncategorized',
};

export type PasteSource =
  | 'fabric-editor'
  | 'apple-pages'
  | 'google-spreadsheets'
  | 'google-docs'
  | 'microsoft-excel'
  | 'microsoft-word'
  | 'dropbox-paper'
  | 'uncategorized';

export const PasteContents: { [P in PasteContent]: P } = {
  text: 'text',
  url: 'url',
  code: 'code',
  mediaSingle: 'mediaSingle',
  mediaCard: 'mediaCard',
  tableCells: 'tableCells',
  table: 'table',
  mixed: 'mixed',
  blockquote: 'blockquote',
  blockCard: 'blockCard',
  bodiedExtension: 'bodiedExtension',
  bulletList: 'bulletList',
  codeBlock: 'codeBlock',
  decisionList: 'decisionList',
  decisionItem: 'decisionItem',
  extension: 'extension',
  heading: 'heading',
  orderedList: 'orderedList',
  panel: 'panel',
  rule: 'rule',
  tableHeader: 'tableHeader',
  tableRow: 'tableRow',
  taskItem: 'taskItem',
  uncategorized: 'uncategorized',
};

export type PasteContent =
  | 'text'
  | 'url'
  | 'code'
  | 'mediaSingle'
  | 'blockquote'
  | 'blockCard'
  | 'bodiedExtension'
  | 'bulletList'
  | 'codeBlock'
  | 'decisionList'
  | 'decisionItem'
  | 'extension'
  | 'heading'
  | 'mediaCard'
  | 'tableCells'
  | 'table'
  | 'orderedList'
  | 'panel'
  | 'rule'
  | 'tableHeader'
  | 'tableRow'
  | 'taskItem'
  | 'uncategorized'
  | 'mixed';

export type PASTE_ACTION_SUBJECT_ID =
  | IActionSubjectId['PASTE_BLOCKQUOTE']
  | IActionSubjectId['PASTE_BLOCK_CARD']
  | IActionSubjectId['PASTE_BODIED_EXTENSION']
  | IActionSubjectId['PASTE_BULLET_LIST']
  | IActionSubjectId['PASTE_CODE_BLOCK']
  | IActionSubjectId['PASTE_DECISION_LIST']
  | IActionSubjectId['PASTE_EXTENSION']
  | IActionSubjectId['PASTE_HEADING']
  | IActionSubjectId['PASTE_MEDIA_GROUP']
  | IActionSubjectId['PASTE_MEDIA_SINGLE']
  | IActionSubjectId['PASTE_ORDERED_LIST']
  | IActionSubjectId['PASTE_PANEL']
  | IActionSubjectId['PASTE_PARAGRAPH']
  | IActionSubjectId['PASTE_RULE']
  | IActionSubjectId['PASTE_TABLE']
  | IActionSubjectId['PASTE_TABLE_CELL']
  | IActionSubjectId['PASTE_TABLE_HEADER']
  | IActionSubjectId['PASTE_TABLE_ROW']
  | IActionSubjectId['PASTE_TASK_LIST'];

type PasteBaseAEP<Action, Attributes> = TrackAEP<
  Action,
  IActionSubject['DOCUMENT'],
  PASTE_IActionSubjectId,
  Attributes
>;

type PasteAEP = PasteBaseAEP<
  IAction['PASTED'],
  {
    inputMethod: IInputMethod['KEYBOARD'];
    type: PasteType;
    content: PasteContent;
    source?: PasteSource;
    pasteSize: number;
  }
>;

type PasteAsPlainAEP = PasteBaseAEP<
  IAction['PASTED_AS_PLAIN'],
  {
    inputMethod: string;
    pasteSize: number;
  }
>;

export type PasteEventPayload = PasteAEP | PasteAsPlainAEP;
