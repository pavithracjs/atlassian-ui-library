import { TrackAEP } from './events';
import {
  IAction,
  IActionSubject,
  IActionSubjectId,
  IInputMethod,
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

export interface IUserContext {
  EDIT: 'edit';
  NEW: 'new';
}

export const USER_CONTEXT: IUserContext = {
  EDIT: 'edit',
  NEW: 'new',
};

export interface ILinkStatus {
  RESOLVED: 'resolved';
  UNRESOLVED: 'unresolved';
}

export const LINK_STATUS = {
  RESOLVED: 'resolved',
  UNRESOLVED: 'unresolved',
};

export interface ILinkRepresentation {
  TEXT: 'text';
  INLINE_CARD: 'inlineCard';
  BLOCK_CARD: 'blockCard';
  EMBED: 'embed';
}

export const LINK_REPRESENTATION = {
  TEXT: 'text',
  INLINE_CARD: 'inlineCard',
  BLOCK_CARD: 'blockCard',
  EMBED: 'embed',
};

export interface ILinkResource {
  JIRA: 'jiraIssue';
  CONFLUENCE: 'confluencePage';
  BITBUCKET_PR: 'bitbucketPR';
  BITBUCKET_REPO: 'bitbucketRepo';
  TRELLO_CARD: 'trelloCard';
  TRELLO_BOARD: 'trelloBoard';
  STATUS_PAGE: 'statusPage';
  BOX: 'boxFile';
  DROPBOX: 'dropboxFile';
  OFFICE: 'office';
  DRIVE: 'drive';
  YOUTUBE: 'youtubeVideo';
  TWITTER: 'twitterTweet';
  OTHER: 'other';
}

export const LINK_RESOURCE = {
  JIRA: 'jiraIssue',
  CONFLUENCE: 'confluencePage',
  BITBUCKET_PR: 'bitbucketPR',
  BITBUCKET_REPO: 'bitbucketRepo',
  TRELLO_CARD: 'trelloCard',
  TRELLO_BOARD: 'trelloBoard',
  STATUS_PAGE: 'statusPage',
  BOX: 'boxFile',
  DROPBOX: 'dropboxFile',
  OFFICE: 'office',
  DRIVE: 'drive',
  YOUTUBE: 'youtubeVideo',
  TWITTER: 'twitterTweet',
  OTHER: 'other',
};

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
      | IPanelType['ERROR']
      | IPanelType['INFO']
      | IPanelType['NOTE']
      | IPanelType['SUCCESS']
      | IPanelType['WARNING'];
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
    userContext?: IUserContext['EDIT'] | IUserContext['NEW'];
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
    status: ILinkStatus['RESOLVED'] | ILinkStatus['UNRESOLVED'];
    representation?:
      | ILinkRepresentation['TEXT']
      | ILinkRepresentation['INLINE_CARD']
      | ILinkRepresentation['INLINE_CARD']
      | ILinkRepresentation['BLOCK_CARD'];
    resourceType?:
      | ILinkResource['JIRA']
      | ILinkResource['CONFLUENCE']
      | ILinkResource['BITBUCKET_PR']
      | ILinkResource['BITBUCKET_REPO']
      | ILinkResource['TRELLO_CARD']
      | ILinkResource['TRELLO_BOARD']
      | ILinkResource['STATUS_PAGE']
      | ILinkResource['BOX']
      | ILinkResource['DROPBOX']
      | ILinkResource['OFFICE']
      | ILinkResource['DRIVE']
      | ILinkResource['YOUTUBE']
      | ILinkResource['TWITTER']
      | ILinkResource['OTHER'];
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
