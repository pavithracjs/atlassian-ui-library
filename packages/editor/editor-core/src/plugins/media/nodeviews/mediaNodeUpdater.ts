import uuidV4 from 'uuid/v4';
import { updateMediaNodeAttrs, replaceExternalMedia } from '../commands';
import { MediaAttributes, ExternalMediaAttributes } from '@atlaskit/adf-schema';
import {
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
} from '@atlaskit/editor-common';
import {
  getViewMediaClientConfigFromMediaProvider,
  getUploadMediaClientConfigFromMediaProvider,
} from '../utils/media-common';
import { getMediaClient } from '@atlaskit/media-client';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { MediaProvider } from '../types';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import { MediaPMPluginOptions } from '../';
import {
  DispatchAnalyticsEvent,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '../../analytics';

export type RemoteDimensions = { id: string; height: number; width: number };

export interface MediaNodeUpdaterProps {
  view: EditorView;
  node: PMNode; // assumed to be media type node (ie. child of MediaSingle, MediaGroup)
  mediaProvider?: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  isMediaSingle: boolean;
  mediaPluginOptions?: MediaPMPluginOptions;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}

export class MediaNodeUpdater {
  props: MediaNodeUpdaterProps;

  constructor(props: MediaNodeUpdaterProps) {
    this.props = props;
  }

  // Updates the node with contextId if it doesn't have one already
  updateContextId = async () => {
    const attrs = this.getAttrs();
    if (!attrs) {
      return;
    }

    const { id } = attrs;
    const objectId = await this.getObjectId();

    updateMediaNodeAttrs(
      id,
      {
        __contextId: objectId,
        contextId: objectId,
      },
      this.props.isMediaSingle,
    )(this.props.view.state, this.props.view.dispatch);
  };

  hasFileAttributesDefined = () => {
    const attrs = this.getAttrs();
    return (
      attrs && attrs.__fileName && attrs.__fileMimeType && attrs.__fileSize
    );
  };

  updateFileAttrs = async () => {
    const attrs = this.getAttrs();
    const mediaProvider = await this.props.mediaProvider;

    if (
      !mediaProvider ||
      !mediaProvider.uploadParams ||
      !attrs ||
      !attrs.id ||
      this.hasFileAttributesDefined()
    ) {
      return;
    }

    const mediaClientConfig = await getViewMediaClientConfigFromMediaProvider(
      mediaProvider,
    );
    const mediaClient = getMediaClient({
      mediaClientConfig,
    });

    const options = {
      collectionName: attrs.collection,
    };

    const fileState = await mediaClient.file.getCurrentState(attrs.id, options);

    if (fileState.status === 'error') {
      return;
    }

    const { name, mimeType, size } = fileState;

    updateMediaNodeAttrs(
      attrs.id,
      {
        __fileName: name,
        __fileMimeType: mimeType,
        __fileSize: size,
      },
      true,
    )(this.props.view.state, this.props.view.dispatch);
  };

  getAttrs = (): MediaAttributes | undefined => {
    const { attrs } = this.props.node;
    if (attrs) {
      return attrs as MediaAttributes;
    }

    return undefined;
  };

  getObjectId = async (): Promise<string | undefined> => {
    const contextIdentifierProvider = await this.props
      .contextIdentifierProvider;

    return contextIdentifierProvider && contextIdentifierProvider.objectId;
  };

  uploadExternalMedia = async (pos: number) => {
    const { node } = this.props;
    const mediaProvider = await this.props.mediaProvider;

    if (node && mediaProvider) {
      const uploadMediaClientConfig = await getUploadMediaClientConfigFromMediaProvider(
        mediaProvider,
      );
      if (!uploadMediaClientConfig || !node.attrs.url) {
        return;
      }
      const mediaClient = getMediaClient({
        mediaClientConfig: uploadMediaClientConfig,
      });

      const collection =
        mediaProvider.uploadParams && mediaProvider.uploadParams.collection;

      try {
        const uploader = await mediaClient.file.uploadExternal(
          node.attrs.url,
          collection,
        );

        const { uploadableFileUpfrontIds, dimensions } = uploader;
        replaceExternalMedia(pos + 1, {
          id: uploadableFileUpfrontIds.id,
          collection,
          height: dimensions.height,
          width: dimensions.width,
        })(this.props.view.state, this.props.view.dispatch);
      } catch (e) {
        //keep it as external media
        if (this.props.dispatchAnalyticsEvent) {
          this.props.dispatchAnalyticsEvent({
            action: ACTION.UPLOAD_EXTERNAL_FAIL,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
          });
        }
      }
    }
  };

  getCurrentContextId = (): string | undefined => {
    const attrs = this.getAttrs();
    if (!attrs) {
      return undefined;
    }

    return attrs.__contextId;
  };

  updateDimensions = (dimensions: RemoteDimensions) => {
    updateMediaNodeAttrs(
      dimensions.id,
      {
        height: dimensions.height,
        width: dimensions.width,
      },
      true,
    )(this.props.view.state, this.props.view.dispatch);
  };

  async getRemoteDimensions(): Promise<false | RemoteDimensions> {
    const mediaProvider = await this.props.mediaProvider;
    const { node, mediaPluginOptions } = this.props;
    const { attrs } = node;
    if (!mediaProvider || !attrs) {
      return false;
    }
    const { height, type, width } = attrs as
      | MediaAttributes
      | ExternalMediaAttributes;
    if (type === 'external') {
      return false;
    }
    const { id, collection } = attrs as MediaAttributes;
    if (height && width) {
      return false;
    }

    // can't fetch remote dimensions on mobile, so we'll default them
    if (mediaPluginOptions && !mediaPluginOptions.allowRemoteDimensionsFetch) {
      return {
        id,
        height: DEFAULT_IMAGE_HEIGHT,
        width: DEFAULT_IMAGE_WIDTH,
      };
    }

    const viewMediaClientConfig = await getViewMediaClientConfigFromMediaProvider(
      mediaProvider,
    );
    const mediaClient = getMediaClient({
      mediaClientConfig: viewMediaClientConfig,
    });
    const state = await mediaClient.getImageMetadata(id, {
      collection,
    });

    if (!state || !state.original) {
      return false;
    }

    return {
      id,
      height: state.original.height || DEFAULT_IMAGE_HEIGHT,
      width: state.original.width || DEFAULT_IMAGE_WIDTH,
    };
  }

  isNodeFromDifferentCollection = async (): Promise<boolean> => {
    const mediaProvider = await this.props.mediaProvider;
    if (!mediaProvider || !mediaProvider.uploadParams) {
      return false;
    }

    const currentCollectionName = mediaProvider.uploadParams.collection;
    const attrs = this.getAttrs();
    if (!attrs) {
      return false;
    }

    const { collection: nodeCollection, __contextId } = attrs;
    const contextId = __contextId || (await this.getObjectId());

    if (contextId && currentCollectionName !== nodeCollection) {
      return true;
    }

    return false;
  };

  copyNode = async () => {
    const mediaProvider = await this.props.mediaProvider;
    const { isMediaSingle, view } = this.props;
    const attrs = this.getAttrs();
    if (!mediaProvider || !mediaProvider.uploadParams || !attrs) {
      return;
    }

    const currentCollectionName = mediaProvider.uploadParams.collection;
    const contextId = this.getCurrentContextId() || (await this.getObjectId());
    const uploadMediaClientConfig = await getUploadMediaClientConfigFromMediaProvider(
      mediaProvider,
    );
    if (!uploadMediaClientConfig) {
      return;
    }
    const mediaClient = getMediaClient({
      mediaClientConfig: uploadMediaClientConfig,
    });

    if (uploadMediaClientConfig.getAuthFromContext && contextId) {
      const auth = await uploadMediaClientConfig.getAuthFromContext(contextId);
      const { id, collection } = attrs;
      const source = {
        id,
        collection,
        authProvider: () => Promise.resolve(auth),
      };
      const destination = {
        collection: currentCollectionName,
        authProvider: uploadMediaClientConfig.authProvider,
        occurrenceKey: uuidV4(),
      };
      const mediaFile = await mediaClient.file.copyFile(source, destination);

      updateMediaNodeAttrs(
        source.id,
        {
          id: mediaFile.id,
          collection: currentCollectionName,
        },
        isMediaSingle,
      )(view.state, view.dispatch);
    }
  };
}
