import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Component } from 'react';
import {
  MediaClient,
  FileDetails,
  Identifier,
  FileIdentifier,
  isPreviewableType,
  isFileIdentifier,
  isDifferentIdentifier,
  isImageRepresentationReady,
} from '@atlaskit/media-client';
import DownloadIcon from '@atlaskit/icon/glyph/download';
import { AnalyticsContext, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { Subscription } from 'rxjs/Subscription';
import { IntlProvider } from 'react-intl';
import { MediaViewer, MediaViewerDataSource } from '@atlaskit/media-viewer';
import { CardAction, CardDimensions, CardProps, CardState } from '../..';
import { CardView } from '../cardView';
import { LazyContent } from '../../utils/lazyContent';
import { getDataURIDimension } from '../../utils/getDataURIDimension';
import { getDataURIFromFileState } from '../../utils/getDataURIFromFileState';
import { extendMetadata } from '../../utils/metadata';
import { isBigger } from '../../utils/dimensionComparer';
import { getCardStatus } from './getCardStatus';
import { InlinePlayer } from '../inlinePlayer';
import {
  getUIAnalyticsContext,
  getBaseAnalyticsContext,
} from '../../utils/analytics';

export class Card extends Component<CardProps, CardState> {
  private hasBeenMounted: boolean = false;

  subscription?: Subscription;
  static defaultProps: Partial<CardProps> = {
    appearance: 'auto',
    resizeMode: 'crop',
    isLazy: true,
    disableOverlay: false,
  };

  state: CardState = {
    status: 'loading',
    isCardVisible: !this.props.isLazy,
    previewOrientation: 1,
    isPlayingFile: false,
  };

  componentDidMount() {
    const { identifier, mediaClient } = this.props;
    this.hasBeenMounted = true;
    this.subscribe(identifier, mediaClient);
  }

  UNSAFE_componentWillReceiveProps(nextProps: CardProps) {
    const {
      mediaClient: currentMediaClient,
      identifier: currentIdentifier,
      dimensions: currentDimensions,
    } = this.props;
    const {
      mediaClient: nextMediaClient,
      identifier: nextIdenfifier,
      dimensions: nextDimensions,
    } = nextProps;
    const isDifferent = isDifferentIdentifier(
      currentIdentifier,
      nextIdenfifier,
    );

    if (
      currentMediaClient !== nextMediaClient ||
      isDifferent ||
      this.shouldRefetchImage(currentDimensions, nextDimensions)
    ) {
      this.subscribe(nextIdenfifier, nextMediaClient);
    }
  }

  shouldRefetchImage = (current?: CardDimensions, next?: CardDimensions) => {
    if (!current || !next) {
      return false;
    }
    return isBigger(current, next);
  };

  componentWillUnmount() {
    this.hasBeenMounted = false;
    this.unsubscribe();
    this.releaseDataURI();
  }

  releaseDataURI = () => {
    const { dataURI } = this.state;
    if (dataURI) {
      URL.revokeObjectURL(dataURI);
    }
  };

  private onLoadingChangeCallback = () => {
    const { onLoadingChange } = this.props;
    if (onLoadingChange) {
      const { status, error, metadata } = this.state;
      const state = {
        type: status,
        payload: error || metadata,
      };
      onLoadingChange(state);
    }
  };

  async subscribe(identifier: Identifier, mediaClient: MediaClient) {
    const { isCardVisible } = this.state;
    if (!isCardVisible) {
      return;
    }

    if (identifier.mediaItemType === 'external-image') {
      const { dataURI, name } = identifier;

      this.setState({
        status: 'complete',
        dataURI,
        metadata: {
          id: dataURI,
          name: name || dataURI,
          mediaType: 'image',
        },
      });

      return;
    }

    const { id, collectionName, occurrenceKey } = identifier;
    const resolvedId = typeof id === 'string' ? id : await id;
    this.unsubscribe();
    this.subscription = mediaClient.file
      .getFileState(resolvedId, { collectionName, occurrenceKey })
      .subscribe({
        next: async fileState => {
          let {
            status,
            progress,
            dataURI,
            previewOrientation = 1,
          } = this.state;
          const metadata = extendMetadata(fileState, this.state.metadata);

          if (!dataURI) {
            const { src, orientation } = await getDataURIFromFileState(
              fileState,
            );
            previewOrientation = orientation || 1;
            dataURI = src;
          }

          switch (fileState.status) {
            case 'uploading':
              progress = fileState.progress;
              status = 'uploading';
              break;
            case 'processing':
              if (dataURI) {
                status = 'complete';
                progress = 1;
              } else {
                status = 'processing';
              }
              break;
            case 'processed':
              status = 'complete';
              break;
            case 'failed-processing':
              status = 'failed-processing';
              break;
            case 'error':
              status = 'error';
          }

          const shouldFetchRemotePreview =
            !dataURI &&
            isImageRepresentationReady(fileState) &&
            metadata.mediaType &&
            isPreviewableType(metadata.mediaType);
          if (shouldFetchRemotePreview) {
            const { appearance, dimensions, resizeMode } = this.props;
            const options = {
              appearance,
              dimensions,
              component: this,
            };
            const width = getDataURIDimension('width', options);
            const height = getDataURIDimension('height', options);
            try {
              const mode =
                resizeMode === 'stretchy-fit' ? 'full-fit' : resizeMode;
              const blob = await mediaClient.getImage(resolvedId, {
                collection: collectionName,
                mode,
                height,
                width,
                allowAnimated: true,
              });
              dataURI = URL.createObjectURL(blob);
              this.releaseDataURI();
            } catch (e) {
              // We don't want to set status=error if the preview fails, we still want to display the metadata
            }
          }

          this.notifyStateChange({
            metadata,
            status,
            progress,
            dataURI,
            previewOrientation,
          });
        },
        error: error => {
          this.notifyStateChange({ error, status: 'error' });
        },
      });
  }

  notifyStateChange = (state: Partial<CardState>) => {
    if (this.hasBeenMounted) {
      this.setState(
        state as Pick<CardState, keyof CardState>,
        this.onLoadingChangeCallback,
      );
    }
  };

  unsubscribe = () => {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    if (this.hasBeenMounted) {
      this.setState({ dataURI: undefined });
    }
  };

  // This method is called when card fails and user press 'Retry'
  private onRetry = () => {
    const { identifier, mediaClient } = this.props;

    this.subscribe(identifier, mediaClient);
  };

  get actions(): CardAction[] {
    const { actions = [], identifier } = this.props;
    const { status, metadata } = this.state;
    if (isFileIdentifier(identifier) && status === 'failed-processing') {
      const downloadAction = {
        label: 'Download',
        icon: <DownloadIcon label="Download" />,
        handler: async () =>
          this.props.mediaClient.file.downloadBinary(
            await identifier.id,
            (metadata as FileDetails).name,
            identifier.collectionName,
          ),
      };
      return [downloadAction, ...actions];
    } else {
      return actions;
    }
  }

  onCardViewClick = async (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    const { identifier, useInlinePlayer, shouldOpenMediaViewer } = this.props;
    const { metadata } = this.state;

    this.onClick(event, analyticsEvent);

    if (!metadata) {
      return;
    }

    const isVideo = metadata && (metadata as FileDetails).mediaType === 'video';
    if (useInlinePlayer && isVideo) {
      this.setState({
        isPlayingFile: true,
      });
    } else if (shouldOpenMediaViewer) {
      let mediaViewerSelectedItem: Identifier | undefined;

      if (isFileIdentifier(identifier)) {
        mediaViewerSelectedItem = {
          id: await identifier.id,
          mediaItemType: 'file',
          collectionName: identifier.collectionName,
          occurrenceKey: identifier.occurrenceKey,
        };
      } else {
        mediaViewerSelectedItem = {
          mediaItemType: 'external-image',
          dataURI: identifier.dataURI,
          name: identifier.name,
        };
      }

      this.setState({
        mediaViewerSelectedItem,
      });
    }
  };

  onInlinePlayerError = () => {
    this.setState({
      isPlayingFile: false,
    });
  };

  renderInlinePlayer = () => {
    const { identifier, mediaClient, dimensions, selected } = this.props;

    return (
      <InlinePlayer
        mediaClient={mediaClient}
        dimensions={dimensions || {}}
        identifier={identifier as FileIdentifier}
        onError={this.onInlinePlayerError}
        onClick={this.onClick}
        selected={selected}
      />
    );
  };

  onMediaViewerClose = () => {
    this.setState({
      mediaViewerSelectedItem: undefined,
    });
  };

  renderMediaViewer = () => {
    const { mediaViewerSelectedItem } = this.state;
    const { mediaClient, identifier, mediaViewerDataSource } = this.props;
    if (!mediaViewerSelectedItem) {
      return;
    }

    const collectionName = isFileIdentifier(identifier)
      ? identifier.collectionName || ''
      : '';
    const dataSource: MediaViewerDataSource = mediaViewerDataSource || {
      list: [],
    };

    return ReactDOM.createPortal(
      <MediaViewer
        collectionName={collectionName}
        dataSource={dataSource}
        context={mediaClient}
        selectedItem={mediaViewerSelectedItem}
        onClose={this.onMediaViewerClose}
      />,
      document.body,
    );
  };

  renderCard = () => {
    const {
      isLazy,
      appearance,
      resizeMode,
      dimensions,
      selectable,
      selected,
      onSelectChange,
      disableOverlay,
    } = this.props;
    const { progress, metadata, dataURI, previewOrientation } = this.state;
    const { onRetry, onCardViewClick, actions, onMouseEnter } = this;
    const status = getCardStatus(this.state, this.props);
    const card = (
      <CardView
        status={status}
        metadata={metadata}
        dataURI={dataURI}
        appearance={appearance}
        resizeMode={resizeMode}
        dimensions={dimensions}
        actions={actions}
        selectable={selectable}
        selected={selected}
        onClick={onCardViewClick}
        onMouseEnter={onMouseEnter}
        onSelectChange={onSelectChange}
        disableOverlay={disableOverlay}
        progress={progress}
        onRetry={onRetry}
        previewOrientation={previewOrientation}
      />
    );

    return isLazy ? (
      <LazyContent placeholder={card} onRender={this.onCardInViewport}>
        {card}
      </LazyContent>
    ) : (
      card
    );
  };

  renderContent() {
    const { isPlayingFile, mediaViewerSelectedItem } = this.state;
    const innerContent = isPlayingFile
      ? this.renderInlinePlayer()
      : this.renderCard();

    return this.context.intl ? (
      innerContent
    ) : (
      <IntlProvider locale="en">
        <>
          {innerContent}
          {mediaViewerSelectedItem ? this.renderMediaViewer() : null}
        </>
      </IntlProvider>
    );
  }

  render() {
    const { metadata } = this.state;
    return (
      /* 
        First Context provides data needed to build packageHierarchy in Atlaskit Analytics Listener and Media Analytics Listener.
        This data is not added to the final GASv3 payload 
      */
      <AnalyticsContext data={getBaseAnalyticsContext()}>
        {/* 
          Second context provides data to be merged with any other context down in the tree and the event's payload.
          This data is usually not available at the time of firing the event, though it is needed to be sent to the backend.
       */}
        <AnalyticsContext data={getUIAnalyticsContext(metadata)}>
          {this.renderContent()}
        </AnalyticsContext>
      </AnalyticsContext>
    );
  }

  onCardInViewport = () => {
    this.setState({ isCardVisible: true }, () => {
      const { identifier, mediaClient } = this.props;
      this.subscribe(identifier, mediaClient);
    });
  };

  onClick = (
    event: React.MouseEvent<HTMLDivElement>,
    analyticsEvent?: UIAnalyticsEvent,
  ) => {
    const { onClick } = this.props;
    const { metadata } = this.state;
    if (onClick) {
      const cardEvent = {
        event,
        mediaItemDetails: metadata,
      };
      onClick(cardEvent, analyticsEvent);
    }
  };

  onMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const { onMouseEnter } = this.props;
    const { metadata } = this.state;
    if (onMouseEnter) {
      const cardEvent = {
        event,
        mediaItemDetails: metadata,
      };
      onMouseEnter(cardEvent);
    }
  };
}
