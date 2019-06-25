import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import { ProsemirrorGetPosHandler } from '../../../nodeviews';
import { EventDispatcher } from '../../../event-dispatcher';
import { MediaProvider } from '../types';
import { EditorAppearance } from '../../../types';
import { MediaOptions } from '../';
import { MediaPluginState } from '../pm-plugins/main';
import { MediaSingleNodeProps } from './types';

export interface MediaSingleNodeProps {
  view: EditorView;
  node: PMNode;
  getPos: ProsemirrorGetPosHandler;
  eventDispatcher: EventDispatcher;
  width: number;
  selected: Function;
  lineLength: number;
  editorAppearance: EditorAppearance;
  mediaOptions: MediaOptions;
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider: Promise<ContextIdentifierProvider>; // TODO: find right interface
  fullWidthMode?: boolean;
  mediaPluginState: MediaPluginState;
}
