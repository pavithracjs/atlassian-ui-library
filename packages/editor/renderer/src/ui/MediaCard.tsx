import * as React from 'react';
import { Component } from 'react';

import { filter } from '@atlaskit/adf-utils';
import {
  CardAppearance,
  CardDimensions,
  Card,
  CardView,
  CardOnClickCallback,
} from '@atlaskit/media-card';
import {
  Context,
  ImageResizeMode,
  FileIdentifier,
  ExternalImageIdentifier,
  Identifier,
} from '@atlaskit/media-core';
import { MediaType } from '@atlaskit/adf-schema';
import {
  withImageLoader,
  ImageStatus,
  // @ts-ignore
  ImageLoaderProps,
  // @ts-ignore
  ImageLoaderState,
} from '@atlaskit/editor-common';
import { RendererAppearance } from './Renderer';
import { RendererContext } from '../react';

export interface MediaProvider {
  viewContext?: Context;
}

export interface MediaCardProps {
  id?: string;
  mediaProvider?: MediaProvider;
  eventHandlers?: {
    media?: {
      onClick?: CardOnClickCallback;
    };
  };
  type: MediaType;
  collection?: string;
  url?: string;
  cardDimensions?: CardDimensions;
  resizeMode?: ImageResizeMode;
  appearance?: CardAppearance;
  rendererAppearance?: RendererAppearance;
  occurrenceKey?: string;
  imageStatus?: ImageStatus;
  disableOverlay?: boolean;
  useInlinePlayer?: boolean;
  rendererContext?: RendererContext;
}

export interface State {
  context?: Context;
}

const mediaIdentifierMap: Map<string, Identifier> = new Map();

export class MediaCardInternal extends Component<MediaCardProps, State> {
  state: State = {};

  async componentDidMount() {
    const {
      rendererContext,
      mediaProvider,
      id: thisId,
      url: thisUrl,
      collection: collectionName,
    } = this.props;

    if (!mediaProvider) {
      return;
    }

    const provider = await mediaProvider;
    const context = await provider.viewContext;

    if (rendererContext && rendererContext.adDoc) {
      if (
        (thisId && !mediaIdentifierMap.has(thisId)) ||
        (thisUrl && !mediaIdentifierMap.has(thisUrl))
      ) {
        filter(rendererContext.adDoc, node => node.type === 'media').forEach(
          mediaNode => {
            if (mediaNode.attrs) {
              const { type, url: dataURI, id } = mediaNode.attrs;

              if (type === 'file' && id) {
                mediaIdentifierMap.set(id, {
                  mediaItemType: 'file',
                  id,
                  collectionName,
                  occurrenceKey: null as any,
                });
              } else if (type === 'external' && dataURI) {
                mediaIdentifierMap.set(dataURI, {
                  mediaItemType: 'external-image',
                  dataURI,
                  name: dataURI,
                });
              }
            }
          },
        );
      }
    }

    this.setState({
      context,
    });
  }

  componentWillUnmount() {
    const { id, url: dataURI } = this.props;

    if (id) {
      mediaIdentifierMap.delete(id);
    } else if (dataURI) {
      mediaIdentifierMap.delete(dataURI);
    }
  }

  private renderLoadingCard = () => {
    const { cardDimensions } = this.props;

    return (
      <CardView
        status="loading"
        mediaItemType="file"
        dimensions={cardDimensions}
      />
    );
  };

  private renderExternal(shouldOpenMediaViewer: boolean) {
    const { context } = this.state;
    const {
      cardDimensions,
      resizeMode,
      appearance,
      url,
      imageStatus,
      disableOverlay,
    } = this.props;

    if (imageStatus === 'loading' || !url) {
      return this.renderLoadingCard();
    }

    const identifier: ExternalImageIdentifier = {
      dataURI: url,
      name: url,
      mediaItemType: 'external-image',
    };

    return (
      <Card
        context={context as any} // context is not really used when the type is external and we want to render the component asap
        identifier={identifier}
        dimensions={cardDimensions}
        appearance={appearance}
        resizeMode={resizeMode}
        disableOverlay={disableOverlay}
        shouldOpenMediaViewer={shouldOpenMediaViewer}
        mediaViewerDataSource={{
          list: Array.from(mediaIdentifierMap.values()),
        }}
      />
    );
  }

  render() {
    const { context } = this.state;
    const {
      eventHandlers,
      id,
      type,
      collection,
      occurrenceKey,
      cardDimensions,
      resizeMode,
      rendererAppearance,
      disableOverlay,
      useInlinePlayer,
    } = this.props;
    const isMobile = rendererAppearance === 'mobile';
    const shouldPlayInline =
      useInlinePlayer !== undefined ? useInlinePlayer : true;
    const onCardClick =
      eventHandlers && eventHandlers.media && eventHandlers.media.onClick;
    const shouldOpenMediaViewer = !isMobile && !onCardClick;

    if (type === 'external') {
      return this.renderExternal(shouldOpenMediaViewer);
    }

    if (type === 'link') {
      return null;
    }

    if (!context || !id) {
      return this.renderLoadingCard();
    }

    if (!id || type !== 'file') {
      return (
        <CardView
          status="error"
          mediaItemType={type}
          dimensions={cardDimensions}
        />
      );
    }

    const identifier: FileIdentifier = {
      id,
      mediaItemType: 'file',
      collectionName: collection,
      occurrenceKey,
    };

    return (
      <Card
        identifier={identifier}
        context={context}
        dimensions={cardDimensions}
        onClick={onCardClick}
        resizeMode={resizeMode}
        isLazy={!isMobile}
        disableOverlay={disableOverlay}
        useInlinePlayer={isMobile ? false : shouldPlayInline}
        shouldOpenMediaViewer={shouldOpenMediaViewer}
        mediaViewerDataSource={{
          list: Array.from(mediaIdentifierMap.values()),
        }}
      />
    );
  }
}

export const MediaCard = withImageLoader<MediaCardProps>(MediaCardInternal);
