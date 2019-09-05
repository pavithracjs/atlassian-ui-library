import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  ContextIdentifierProvider,
  ProviderFactory,
} from '@atlaskit/editor-common';
import { ProsemirrorGetPosHandler } from '../../../nodeviews';
import { EventDispatcher } from '../../../event-dispatcher';
import { MediaProvider } from '../types';
import { MediaOptions, MediaPMPluginOptions } from '../index';
import { MediaPluginState } from '../pm-plugins/main';
import { MediaSingleNodeProps } from './types';
import { DispatchAnalyticsEvent } from '../../analytics';

export interface MediaSingleNodeProps {
  view: EditorView;
  node: PMNode;
  getPos: ProsemirrorGetPosHandler;
  eventDispatcher: EventDispatcher;
  width: number;
  selected: Function;
  lineLength: number;
  mediaPluginOptions?: MediaPMPluginOptions;
  mediaOptions: MediaOptions;
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  fullWidthMode?: boolean;
  mediaPluginState: MediaPluginState;
  dispatchAnalyticsEvent: DispatchAnalyticsEvent;
}

export interface MediaSingleNodeViewProps {
  eventDispatcher: EventDispatcher;
  providerFactory: ProviderFactory;
  mediaOptions: MediaOptions;
  mediaPluginOptions?: MediaPMPluginOptions;
  fullWidthMode?: boolean;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}
