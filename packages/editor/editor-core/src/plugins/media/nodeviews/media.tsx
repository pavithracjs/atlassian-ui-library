import * as React from 'react';
import { Component } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import {
  ProviderFactory,
  ImageLoaderProps,
  withImageLoader,
} from '@atlaskit/editor-common';

import {
  Card,
  CardDimensions,
  CardLoading,
  CardOnClickCallback,
} from '@atlaskit/media-card';
import { Identifier } from '@atlaskit/media-client';
import { MediaClientConfig } from '@atlaskit/media-core';

import {
  MediaPluginState,
  stateKey as mediaStateKey,
  MediaProvider,
} from '../pm-plugins/main';

import { ProsemirrorGetPosHandler, ReactNodeProps } from '../../../nodeviews';

// This is being used by DropPlaceholder now
export const MEDIA_HEIGHT = 125;
export const FILE_WIDTH = 156;

export type Appearance = 'small' | 'image' | 'horizontal' | 'square';

export interface MediaNodeProps extends ReactNodeProps, ImageLoaderProps {
  view: EditorView;
  node: PMNode;
  getPos: ProsemirrorGetPosHandler;
  providerFactory?: ProviderFactory;
  cardDimensions: CardDimensions;
  isMediaSingle?: boolean;
  onClick?: CardOnClickCallback;
  onExternalImageLoaded?: (
    dimensions: { width: number; height: number },
  ) => void;
  allowLazyLoading?: boolean;
  mediaProvider?: Promise<MediaProvider>;
  viewMediaClientConfig?: MediaClientConfig;
  uploadComplete?: boolean;
}

class MediaNode extends Component<MediaNodeProps> {
  private mediaPluginState: MediaPluginState;

  constructor(props: MediaNodeProps) {
    super(props);
    const { view } = this.props;
    this.mediaPluginState = mediaStateKey.getState(view.state);
  }

  shouldComponentUpdate(nextProps: MediaNodeProps & ImageLoaderProps) {
    if (
      this.props.selected !== nextProps.selected ||
      this.props.viewMediaClientConfig !== nextProps.viewMediaClientConfig ||
      this.props.uploadComplete !== nextProps.uploadComplete ||
      this.props.node.attrs.id !== nextProps.node.attrs.id ||
      this.props.node.attrs.collection !== nextProps.node.attrs.collection ||
      this.props.cardDimensions.height !== nextProps.cardDimensions.height ||
      this.props.cardDimensions.width !== nextProps.cardDimensions.width
    ) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    this.handleNewNode(this.props);
  }

  componentWillUnmount() {
    const { node } = this.props;
    this.mediaPluginState.handleMediaNodeUnmount(node);
  }

  componentDidUpdate(prevProps: Readonly<MediaNodeProps & ImageLoaderProps>) {
    if (prevProps.node.attrs.id !== this.props.node.attrs.id) {
      this.mediaPluginState.handleMediaNodeUnmount(prevProps.node);
      this.handleNewNode(this.props);
    }
    this.mediaPluginState.updateElement();
  }

  render() {
    const {
      node,
      selected,
      cardDimensions,
      onClick,
      allowLazyLoading,
      viewMediaClientConfig,
      uploadComplete,
    } = this.props;

    const { id, type, collection, url } = node.attrs;

    if (
      type !== 'external' &&
      (!viewMediaClientConfig ||
        (typeof uploadComplete === 'boolean' && !uploadComplete))
    ) {
      return <CardLoading dimensions={cardDimensions} />;
    }

    const identifier: Identifier =
      type === 'external'
        ? {
            dataURI: url!,
            name: url,
            mediaItemType: 'external-image',
          }
        : {
            id,
            mediaItemType: 'file',
            collectionName: collection!,
          };

    return (
      <Card
        // mediaClientConfig is not needed for "external" case. So we have to cheat here.
        // there is a possibility mediaClientConfig will be part of a identifier,
        // so this might be not an issue
        mediaClientConfig={viewMediaClientConfig!}
        resizeMode="stretchy-fit"
        dimensions={cardDimensions}
        identifier={identifier}
        selectable={true}
        selected={selected}
        disableOverlay={true}
        onClick={onClick}
        useInlinePlayer={allowLazyLoading}
        isLazy={allowLazyLoading}
      />
    );
  }

  private handleNewNode = (props: MediaNodeProps) => {
    const { node } = props;

    // +1 indicates the media node inside the mediaSingle nodeview
    this.mediaPluginState.handleMediaNodeMount(
      node,
      () => this.props.getPos() + 1,
    );
  };
}

export default withImageLoader<MediaNodeProps>(MediaNode);
