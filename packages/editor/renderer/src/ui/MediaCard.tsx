import * as React from 'react';
import { Component } from 'react';

import { filter, ADFEntity } from '@atlaskit/adf-utils';
import {
  CardAppearance,
  CardDimensions,
  Card,
  CardLoading,
  CardError,
  CardOnClickCallback,
} from '@atlaskit/media-card';
import { Context, MediaClientConfig } from '@atlaskit/media-core';
import {
  ImageResizeMode,
  FileIdentifier,
  ExternalImageIdentifier,
  Identifier,
  getMediaClient,
  FileState,
} from '@atlaskit/media-client';
import { MediaType } from '@atlaskit/adf-schema';
import {
  withImageLoader,
  ImageStatus,
  // @ts-ignore
  ImageLoaderProps,
  // @ts-ignore
  ImageLoaderState,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';
import { RendererAppearance } from './Renderer/types';
import { RendererContext } from '../react';
import { XOR } from '@atlaskit/type-helpers';
import styled from 'styled-components';

export interface WithViewMediaClientConfig {
  viewMediaClientConfig: MediaClientConfig;
}

export type WithViewContext = {
  /**
   * @deprecated Use viewMediaClientConfig instead.
   */
  viewContext: Promise<Context>;
};

export type MediaProvider = XOR<WithViewMediaClientConfig, WithViewContext>;

export interface MediaCardProps {
  id?: string;
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
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
  mediaClientConfig?: MediaClientConfig;
  contextIdentifierProvider?: ContextIdentifierProvider;
  fileState?: FileState;
}

const mediaIdentifierMap: Map<string, Identifier> = new Map();

export const getListOfIdentifiersFromDoc = (doc?: ADFEntity): Identifier[] => {
  if (!doc) {
    return [];
  }
  return filter(doc, node => node.type === 'media').reduce(
    (identifierList: Identifier[], mediaNode) => {
      if (mediaNode.attrs) {
        const { type, url: dataURI, id } = mediaNode.attrs;

        if (type === 'file' && id) {
          identifierList.push({
            mediaItemType: 'file',
            id,
          });
        } else if (type === 'external' && dataURI) {
          identifierList.push({
            mediaItemType: 'external-image',
            dataURI,
            name: dataURI,
          });
        }
      }
      return identifierList;
    },
    [],
  );
};

export class MediaCardInternal extends Component<MediaCardProps, State> {
  state: State = {};

  async componentDidMount() {
    const {
      rendererContext,
      mediaProvider,
      contextIdentifierProvider,
      id,
      url,
      collection: collectionName,
    } = this.props;

    if (!mediaProvider) {
      return;
    }

    if (contextIdentifierProvider) {
      this.setState({
        contextIdentifierProvider: await contextIdentifierProvider,
      });
    }
    const mediaProviderObject = await mediaProvider;
    let mediaClientConfig: MediaClientConfig;
    if (mediaProviderObject.viewMediaClientConfig) {
      mediaClientConfig = mediaProviderObject.viewMediaClientConfig;
    } else if (mediaProviderObject.viewContext) {
      mediaClientConfig = (await mediaProviderObject.viewContext).config;
    } else {
      return;
    }

    const nodeIsInCache =
      (id && mediaIdentifierMap.has(id)) ||
      (url && mediaIdentifierMap.has(url));
    if (rendererContext && rendererContext.adDoc && !nodeIsInCache) {
      getListOfIdentifiersFromDoc(rendererContext.adDoc).forEach(identifier => {
        if (identifier.mediaItemType === 'file') {
          mediaIdentifierMap.set(identifier.id as string, {
            ...identifier,
            collectionName,
          });
        } else if (identifier.mediaItemType === 'external-image') {
          mediaIdentifierMap.set(identifier.dataURI as string, identifier);
        }
      });
    }
    this.setState({
      mediaClientConfig: mediaClientConfig,
    });

    if (id) {
      this.saveFileState(id, mediaClientConfig);
    }
  }

  UNSAFE_componentWillReceiveProps(newProps: MediaCardProps) {
    const { mediaClientConfig } = this.state;
    const { id: newId } = newProps;
    if (mediaClientConfig && newId && newId !== this.props.id) {
      this.saveFileState(newId, mediaClientConfig);
    }
  }

  componentWillUnmount() {
    const { id, url: dataURI } = this.props;

    if (id) {
      mediaIdentifierMap.delete(id);
    } else if (dataURI) {
      mediaIdentifierMap.delete(dataURI);
    }
  }

  saveFileState = async (id: string, mediaClientConfig: MediaClientConfig) => {
    const { collection: collectionName } = this.props;
    const mediaClient = getMediaClient({
      mediaClientConfig,
    });
    const options = {
      collectionName,
    };
    const fileState = await mediaClient.file.getCurrentState(id, options);
    this.setState({
      fileState,
    });
  };

  private renderLoadingCard = () => {
    const { cardDimensions } = this.props;

    return <CardLoading dimensions={cardDimensions} />;
  };

  private renderExternal(shouldOpenMediaViewer: boolean) {
    const { mediaClientConfig } = this.state;
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
        // context is not really used when the type is external and we want to render the component asap
        mediaClientConfig={mediaClientConfig!}
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
    const {
      contextIdentifierProvider,
      mediaClientConfig,
      fileState,
    } = this.state;
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
      return this.renderExternal(shouldOpenMediaViewer);
    }

    if (type === 'link') {
      return null;
    }

    if (!mediaClientConfig || !id) {
      return this.renderLoadingCard();
    }

    if (!id || type !== 'file') {
      return <CardError dimensions={cardDimensions} />;
    }

    const identifier: FileIdentifier = {
      id,
      mediaItemType: 'file',
      collectionName: collection,
      occurrenceKey,
    };

    return (
      <CardWrapper
        {...getClipboardAttrs({
          id,
          collection,
          contextIdentifierProvider,
          cardDimensions,
          fileState,
        })}
      >
        <Card
          identifier={identifier}
          mediaClientConfig={mediaClientConfig}
          dimensions={cardDimensions}
          onClick={onCardClick}
          resizeMode={resizeMode}
          isLazy={!isMobile}
          disableOverlay={disableOverlay}
          useInlinePlayer={isInlinePlayer}
          shouldOpenMediaViewer={shouldOpenMediaViewer}
          mediaViewerDataSource={{
            list: Array.from(mediaIdentifierMap.values()),
          }}
        />
      </CardWrapper>
    );
  }
}

export const CardWrapper = styled.div``;

// Needed for copy & paste
export const getClipboardAttrs = ({
  id,
  collection,
  contextIdentifierProvider,
  cardDimensions,
  fileState,
}: {
  id: string;
  collection?: string;
  contextIdentifierProvider?: ContextIdentifierProvider;
  cardDimensions?: CardDimensions;
  fileState?: FileState;
}): { [key: string]: string | number | undefined } => {
  const contextId =
    contextIdentifierProvider && contextIdentifierProvider.objectId;
  const width =
    cardDimensions &&
    cardDimensions.width &&
    parseInt(`${cardDimensions.width}`);
  const height =
    cardDimensions &&
    cardDimensions.height &&
    parseInt(`${cardDimensions.height}`);
  let fileName = 'file'; // default name is needed for Confluence
  let fileSize = 1;
  let fileMimeType = '';

  if (fileState && fileState.status !== 'error') {
    fileSize = fileState.size;
    fileName = fileState.name;
    fileMimeType = fileState.mimeType;
  }

  return {
    'data-context-id': contextId,
    'data-type': 'file',
    'data-node-type': 'media',
    'data-width': width,
    'data-height': height,
    'data-id': id,
    'data-collection': collection,
    'data-file-name': fileName,
    'data-file-size': fileSize,
    'data-file-mime-type': fileMimeType,
  };
};

export const MediaCard = withImageLoader<MediaCardProps>(MediaCardInternal);
