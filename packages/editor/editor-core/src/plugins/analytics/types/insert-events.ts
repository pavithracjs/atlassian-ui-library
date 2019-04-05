import { TrackAEP } from './events';
import {
  IAction,
  IActionSubject,
  IActionSubjectId,
  IInputMethod,
} from './enums';

export const enum PANEL_TYPE {
  INFO = 'info',
  SUCCESS = 'success',
  NOTE = 'note',
  WARNING = 'warning',
  ERROR = 'error',
}

export const enum USER_CONTEXT {
  EDIT = 'edit',
  NEW = 'new',
}

export const enum LINK_STATUS {
  RESOLVED = 'resolved',
  UNRESOLVED = 'unresolved',
}

export const enum LINK_REPRESENTATION {
  TEXT = 'text',
  INLINE_CARD = 'inlineCard',
  BLOCK_CARD = 'blockCard',
  EMBED = 'embed',
}

export const enum LINK_RESOURCE {
  JIRA = 'jiraIssue',
  CONFLUENCE = 'confluencePage',
  BITBUCKET_PR = 'bitbucketPR',
  BITBUCKET_REPO = 'bitbucketRepo',
  TRELLO_CARD = 'trelloCard',
  TRELLO_BOARD = 'trelloBoard',
  STATUS_PAGE = 'statusPage',
  BOX = 'boxFile',
  DROPBOX = 'dropboxFile',
  OFFICE = 'office',
  DRIVE = 'drive',
  YOUTUBE = 'youtubeVideo',
  TWITTER = 'twitterTweet',
  OTHER = 'other',
}

type InsertAEP<ActionSubjectID, Attributes> = TrackAEP<
  IAction['INSERTED'],
  IActionSubject['DOCUMENT'],
  ActionSubjectID,
  Attributes
>;

type InsertLineBreakAEP = TrackAEP<
  IAction['INSERTED'],
  IActionSubject['TEXT'],
  IActionSubjectId['LINE_BREAK'],
  undefined
>;

type InsertDividerAEP = InsertAEP<
  IActionSubjectId['DIVIDER'],
  {
    inputMethod:
      | IInputMethod['QUICK_INSERT']
      | IInputMethod['TOOLBAR']
      | IInputMethod['INSERT_MENU']
      | IInputMethod['FORMATTING']
      | IInputMethod['SHORTCUT'];
  }
>;

type InsertPanelAEP = InsertAEP<
  IActionSubjectId['PANEL'],
  {
    inputMethod:
      | IInputMethod['QUICK_INSERT']
      | IInputMethod['TOOLBAR']
      | IInputMethod['INSERT_MENU'];
    panelType:
      | PANEL_TYPE.ERROR
      | PANEL_TYPE.INFO
      | PANEL_TYPE.NOTE
      | PANEL_TYPE.SUCCESS
      | PANEL_TYPE.WARNING;
  }
>;

type InsertCodeBlockAEP = InsertAEP<
  IActionSubjectId['CODE_BLOCK'],
  {
    inputMethod:
      | IInputMethod['QUICK_INSERT']
      | IInputMethod['TOOLBAR']
      | IInputMethod['INSERT_MENU']
      | IInputMethod['FORMATTING']
      | IInputMethod['INSERT_MENU'];
  }
>;

type InsertTableAEP = InsertAEP<
  IActionSubjectId['TABLE'],
  {
    inputMethod:
      | IInputMethod['QUICK_INSERT']
      | IInputMethod['TOOLBAR']
      | IInputMethod['INSERT_MENU']
      | IInputMethod['FORMATTING']
      | IInputMethod['SHORTCUT'];
  }
>;

type InsertActionDecisionAEP = InsertAEP<
  IActionSubjectId['DECISION'] | IActionSubjectId['ACTION'],
  {
    inputMethod:
      | IInputMethod['QUICK_INSERT']
      | IInputMethod['TOOLBAR']
      | IInputMethod['INSERT_MENU']
      | IInputMethod['FORMATTING']
      | IInputMethod['KEYBOARD'];
    containerAri?: string;
    objectAri?: string;
    localId: string;
    listLocalId: string;
    userContext?: USER_CONTEXT.EDIT | USER_CONTEXT.NEW;
    position: number;
    listSize: number;
  }
>;

type InsertEmojiAEP = InsertAEP<
  IActionSubjectId['EMOJI'],
  {
    inputMethod:
      | IInputMethod['TYPEAHEAD']
      | IInputMethod['PICKER']
      | IInputMethod['ASCII'];
  }
>;

type InsertStatusAEP = InsertAEP<
  IActionSubjectId['STATUS'],
  {
    inputMethod:
      | IInputMethod['QUICK_INSERT']
      | IInputMethod['TOOLBAR']
      | IInputMethod['INSERT_MENU'];
  }
>;

export type InputMethodInsertMedia =
  | IInputMethod['CLIPBOARD']
  | IInputMethod['PICKER_CLOUD']
  | IInputMethod['DRAG_AND_DROP'];

type InsertMediaAEP = InsertAEP<
  IActionSubjectId['MEDIA'],
  {
    inputMethod: InputMethodInsertMedia;
    fileExtension: string | undefined;
  }
>;

type InsertLinkAEP = InsertAEP<
  IActionSubjectId['LINK'],
  {
    inputMethod:
      | IInputMethod['TYPEAHEAD']
      | IInputMethod['CLIPBOARD']
      | IInputMethod['FORMATTING']
      | IInputMethod['AUTO_DETECT']
      | IInputMethod['MANUAL'];
  }
>;

type InsertLinkPreviewAEP = InsertAEP<
  IActionSubjectId['LINK_PREVIEW'],
  {
    status: LINK_STATUS.RESOLVED | LINK_STATUS.UNRESOLVED;
    representation?:
      | LINK_REPRESENTATION.TEXT
      | LINK_REPRESENTATION.INLINE_CARD
      | LINK_REPRESENTATION.INLINE_CARD
      | LINK_REPRESENTATION.BLOCK_CARD;
    resourceType?:
      | LINK_RESOURCE.JIRA
      | LINK_RESOURCE.CONFLUENCE
      | LINK_RESOURCE.BITBUCKET_PR
      | LINK_RESOURCE.BITBUCKET_REPO
      | LINK_RESOURCE.TRELLO_CARD
      | LINK_RESOURCE.TRELLO_BOARD
      | LINK_RESOURCE.STATUS_PAGE
      | LINK_RESOURCE.BOX
      | LINK_RESOURCE.DROPBOX
      | LINK_RESOURCE.OFFICE
      | LINK_RESOURCE.DRIVE
      | LINK_RESOURCE.YOUTUBE
      | LINK_RESOURCE.TWITTER
      | LINK_RESOURCE.OTHER;
  }
>;

export type InsertEventPayload =
  | InsertDividerAEP
  | InsertLineBreakAEP
  | InsertPanelAEP
  | InsertCodeBlockAEP
  | InsertTableAEP
  | InsertActionDecisionAEP
  | InsertEmojiAEP
  | InsertStatusAEP
  | InsertMediaAEP
  | InsertLinkAEP
  | InsertLinkPreviewAEP;
