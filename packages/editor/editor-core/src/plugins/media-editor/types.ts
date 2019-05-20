import { FileIdentifier, Context } from '@atlaskit/media-core';

export type MediaEditorState = {
  context?: Context;
  editor?: {
    pos: number;
    identifier: FileIdentifier;
  };
};

export type OpenMediaEditor = {
  type: 'open';
  pos: number;
  identifier: FileIdentifier;
};

export type UploadAnnotation = {
  type: 'upload';
  newIdentifier: FileIdentifier;
};

export type CloseMediaEditor = {
  type: 'close';
};

export type SetMediaContext = {
  type: 'setContext';
  context?: Context;
};

export type MediaEditorAction =
  | OpenMediaEditor
  | CloseMediaEditor
  | UploadAnnotation
  | SetMediaContext;
