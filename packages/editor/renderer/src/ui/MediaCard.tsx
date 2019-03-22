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
  ADNode,
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
    } = this.props as any;
    const isMobile = rendererAppearance === 'mobile';
    const shouldPlayInline =
      useInlinePlayer !== undefined ? useInlinePlayer : true;
    const onCardClick =
      eventHandlers && eventHandlers.media && eventHandlers.media.onClick;
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

    const list = getMediaFromADF(rendererContext.adDoc);

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
        mediaViewerDataSource={{ list }}
      />
    );
  }
}

export const MediaCard = withImageLoader<MediaCardProps>(MediaCardInternal);

type CallBackType = (key: string, value: any) => void;

function traverseADTree(root: any, callbackFunc: CallBackType) {
  for (const nodeKey of Object.keys(root)) {
    const nodeValue: any = root[nodeKey] as any;
    callbackFunc(nodeKey, nodeValue);

    // go deeper
    if (nodeValue !== null && typeof nodeValue === 'object') {
      traverseADTree(root[nodeKey] as any, callbackFunc);
    }
  }
}

function filterADNodesByType(root: ADNode, typeName: string): ADNode[] {
  const results: ADNode[] = [];

  traverseADTree(root, (nodeKey, nodeValue) => {
    if (nodeValue && nodeValue.type === typeName) {
      results.push(nodeValue as ADNode);
    }
  });

  return results;
}

const getMediaFromADF = (adf: any): any[] => {
  return filterADNodesByType(adf, 'media').map(({ attrs }) => ({
    id: attrs.id,
    mediaItemType: attrs.type,
    collectionName: attrs.collection,
    occurrenceKey: null, // media viewer has a strict comparison of selected item's occurrenceKey against the list of items for navigation
  }));
};
