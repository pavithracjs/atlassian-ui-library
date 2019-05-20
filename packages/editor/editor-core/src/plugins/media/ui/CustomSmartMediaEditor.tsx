import * as React from 'react';
import { FileIdentifier } from '@atlaskit/media-core';
import { Dimensions, SmartMediaEditor } from '@atlaskit/media-editor';
import { MediaPluginState } from '../pm-plugins/main';

type Props = {
  mediaState: MediaPluginState;
};

/**
 * Generate a file identifier given a media plugin state
 */
function getFileIdentifier(
  mediaState: MediaPluginState,
): FileIdentifier | null {
  if (!mediaState) {
    return null;
  }

  const node = mediaState.selectedMediaContainerNode();
  if (!node) {
    return null;
  }
  const { id } = node.firstChild!.attrs;

  return {
    id,
    mediaItemType: 'file',
    collectionName: node.firstChild!.attrs.collection,
  };
}

/**
 * Wrapper over SmartMediaEditor to map:
 *  MediaPluginState -> SmartMediaEditorProps
 * Also prevent bad rendering caused by WithPluginState
 */
export default class CustomSmartMediaEditor extends React.Component<Props> {
  private handleUploadStart = (
    newFileIdentifier: FileIdentifier,
    dimensions: Dimensions,
  ) => {
    const { mediaState } = this.props;

    mediaState.closeMediaEditor();
    mediaState.replaceEditingMedia(newFileIdentifier, dimensions);
  };

  shouldComponentUpdate(nextProps: Props) {
    const fileIdentifier = getFileIdentifier(this.props.mediaState);
    const newFileIdentifier = getFileIdentifier(nextProps.mediaState);

    if (!fileIdentifier || !newFileIdentifier) {
      return true;
    }

    return (
      fileIdentifier.id !== newFileIdentifier.id ||
      this.props.mediaState.uploadContext !==
        nextProps.mediaState.uploadContext ||
      this.props.mediaState.showEditingDialog !==
        nextProps.mediaState.showEditingDialog
    );
  }

  render() {
    const { mediaState } = this.props;
    const identifier = getFileIdentifier(mediaState);
    if (!identifier) {
      return null;
    }

    if (mediaState.uploadContext && mediaState.showEditingDialog) {
      return (
        <SmartMediaEditor
          identifier={identifier}
          context={mediaState.uploadContext}
          onUploadStart={this.handleUploadStart}
          onFinish={mediaState.closeMediaEditor}
        />
      );
    }

    return null;
  }
}
