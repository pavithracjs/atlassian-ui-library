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

// any[] is because despite occurrenceKey in FileIndentifier defined as string | undefined, it is passed as null by actual adf node,
// while media viewer has a strict comparison of selected item's occurrenceKey against the list of items for navigation
// so we have to explicitly set it to null in the list until Media Viewer is not fixed
const mediaIdentifierList: any[] = [];

export class MediaCardInternal extends Component<MediaCardProps, State> {
  state: State = {};

  async componentDidMount() {
    const { mediaProvider } = this.props;

    if (!mediaProvider) {
      return;
    }

    const provider = await mediaProvider;
    const context = await provider.viewContext;

    this.setState({
      context,
    });
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
        mediaViewerDataSource={{ list: mediaIdentifierList }}
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
      rendererContext,
    } = this.props;
    const isMobile = rendererAppearance === 'mobile';
    const shouldPlayInline =
      useInlinePlayer !== undefined ? useInlinePlayer : true;
    const onCardClick =
      eventHandlers && eventHandlers.media && eventHandlers.media.onClick;
    const shouldOpenMediaViewer = !isMobile && !onCardClick;

    if (rendererContext && rendererContext.adDoc) {
      filter(rendererContext.adDoc, adNode => adNode.type === 'media').forEach(
        adfNode => {
          if (adfNode.attrs) {
            if (
              adfNode.attrs.type === 'file' &&
              !mediaIdentifierList.find(
                identifier => identifier.id === adfNode.attrs!.id,
              )
            ) {
              mediaIdentifierList.push({
                id: adfNode.attrs.id,
                mediaItemType: adfNode.attrs.type,
                collectionName: adfNode.attrs.collection,
                occurrenceKey: null,
              });
            } else if (
              adfNode.attrs.type === 'external' &&
              !mediaIdentifierList.find(
                identifier => identifier.dataURI === adfNode.attrs!.url,
              )
            ) {
              mediaIdentifierList.push({
                dataURI: adfNode.attrs.url,
                mediaItemType: 'external-image',
                name: adfNode.attrs.name,
              });
            }
          }
        },
      );
    }

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
        mediaViewerDataSource={{ list: mediaIdentifierList }}
      />
    );
  }
}

export const MediaCard = withImageLoader<MediaCardProps>(MediaCardInternal);
