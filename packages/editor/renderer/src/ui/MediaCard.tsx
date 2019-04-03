import * as React from 'react';
import { Component } from 'react';
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
}

export interface State {
  context?: Context;
}

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

  private renderExternal() {
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
      />
    );
  }

  /**
   * We want to call provided `eventHandlers.media.onClick` when it's provided,
   * but we also don't want to call it when it's a video and inline video player is enabled.
   * This is due to consumers normally process this onClick call by opening media viewer and
   * we don't want that to happened described above text.
   */
  private getOnCardClickCallback = (isInlinePlayer: boolean) => {
    const { eventHandlers } = this.props;
    if (eventHandlers && eventHandlers.media && eventHandlers.media.onClick) {
      return ((result, analyticsEvent) => {
        const isVideo =
          result.mediaItemDetails &&
          result.mediaItemDetails.mediaType === 'video';
        const isVideoWithInlinePlayer = isInlinePlayer && isVideo;
        if (
          !isVideoWithInlinePlayer &&
          eventHandlers &&
          eventHandlers.media &&
          eventHandlers.media.onClick
        ) {
          eventHandlers.media.onClick(result, analyticsEvent);
        }
      }) as CardOnClickCallback;
    }

    return undefined;
  };

  render() {
    const { context } = this.state;
    const {
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
    const isInlinePlayer = isMobile ? false : shouldPlayInline;

    const onCardClick = this.getOnCardClickCallback(isInlinePlayer);

    const shouldOpenMediaViewer = !isMobile && !onCardClick;

    if (type === 'external') {
      return this.renderExternal();
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
        useInlinePlayer={isInlinePlayer}
        shouldOpenMediaViewer={shouldOpenMediaViewer}
      />
    );
  }
}

export const MediaCard = withImageLoader<MediaCardProps>(MediaCardInternal);
