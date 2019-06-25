import { updateMediaNodeAttrs } from '../commands';
import { MediaSingleNodeProps } from './types';
import { MediaAttributes, ExternalMediaAttributes } from '@atlaskit/adf-schema';
import {
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
} from '@atlaskit/editor-common';

export type RemoteDimensions = { id: string; height: number; width: number };
export class MediaNodeUpdater {
  props: MediaSingleNodeProps;

  constructor(props: MediaSingleNodeProps) {
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
    console.log('updateContextId updateMediaNodeAttrs', id, objectId);
    updateMediaNodeAttrs(
      id,
      {
        __contextId: objectId,
        contextId: objectId,
      },
      true,
    )(this.props.view.state, this.props.view.dispatch);
  };

  getAttrs = (): MediaAttributes | undefined => {
    const { firstChild } = this.props.node;
    if (firstChild) {
      return firstChild.attrs as MediaAttributes;
    }

    return undefined;
  };

  getObjectId = async (): Promise<string> => {
    const contextIdentifierProvider = await this.props
      .contextIdentifierProvider;

    return contextIdentifierProvider.objectId;
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
    const { firstChild } = this.props.node;
    if (!mediaProvider || !firstChild) {
      return false;
    }
    const { height, type, width } = firstChild.attrs as
      | MediaAttributes
      | ExternalMediaAttributes;
    if (type === 'external') {
      return false;
    }
    const { id, collection } = firstChild.attrs as MediaAttributes;
    if (height && width) {
      return false;
    }

    // can't fetch remote dimensions on mobile, so we'll default them
    if (this.props.editorAppearance === 'mobile') {
      return {
        id,
        height: DEFAULT_IMAGE_HEIGHT,
        width: DEFAULT_IMAGE_WIDTH,
      };
    }

    const viewContext = await mediaProvider.viewContext;
    const state = await viewContext.getImageMetadata(id, {
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
    console.log('isNodeFromDifferentCollection', {
      contextId,
      currentCollectionName,
      nodeCollection,
    });
    if (contextId && currentCollectionName !== nodeCollection) {
      return true;
    }

    return false;
  };

  // TODO: find a better name
  copyNode = async () => {
    const mediaProvider = await this.props.mediaProvider;
    if (!mediaProvider || !mediaProvider.uploadParams) {
      return;
    }

    const currentCollectionName = mediaProvider.uploadParams.collection;
    const attrs = this.getAttrs();
    if (!attrs) {
      return;
    }

    const { collection: nodeCollection, __contextId } = attrs;

    console.log('copyNode', {
      __contextId,
      currentCollectionName,
      nodeCollection,
    });
    if (__contextId && currentCollectionName !== nodeCollection) {
      const uploadContext = await mediaProvider.uploadContext;

      if (uploadContext && uploadContext.config.getAuthFromContext) {
        const auth = await uploadContext.config.getAuthFromContext(__contextId);
        // TODO: call copyWithToken with that auth
        console.log({ auth });
      }
    }
  };
}
