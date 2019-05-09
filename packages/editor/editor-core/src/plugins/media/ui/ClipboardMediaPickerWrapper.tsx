import * as React from 'react';
import {
  MediaPluginState,
  MediaProvider,
  MediaState,
} from '../pm-plugins/main';
import {
  Clipboard,
  isImagePreview,
  UploadPreviewUpdateEventPayload,
  UploadParams,
  UploadErrorEventPayload,
} from '@atlaskit/media-picker';
import { Context } from '@atlaskit/media-core';
import { ErrorReporter } from '@atlaskit/editor-common';
import {
  MediaStateEventSubscriber,
  MediaStateEventListener,
} from '../picker-facade';

type Props = {
  mediaState: MediaPluginState;
};

type State = {
  uploadParams?: UploadParams;
  context?: Context;
};

export default class ClipboardMediaPickerWrapper extends React.Component<
  Props,
  State
> {
  state: State = {};

  componentDidMount() {
    this.props.mediaState.options.providerFactory.subscribe(
      'mediaProvider',
      async (name, provider?: Promise<MediaProvider>) => {
        const mediaProvider = await provider;
        if (!mediaProvider) {
          return;
        }

        this.setState({
          uploadParams: mediaProvider.uploadParams,
          context: await mediaProvider.uploadContext,
        });
      },
    );
  }

  onPreviewUpdate = (event: UploadPreviewUpdateEventPayload) => {
    const { mediaState } = this.props;

    let { file, preview } = event;
    const { dimensions, scaleFactor } = isImagePreview(preview)
      ? preview
      : { dimensions: undefined, scaleFactor: undefined };

    const state: MediaState = {
      id: file.id,
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type,
      dimensions,
      scaleFactor,
    };

    const cb: MediaStateEventSubscriber = (
      listener: MediaStateEventListener,
    ) => {
      // Do we need this ?
    };
    mediaState.insertFile(state, cb);
  };

  onError = ({ error }: UploadErrorEventPayload) => {
    const {
      mediaState: { options },
    } = this.props;
    if (!error || !error.fileId) {
      const err = new Error(
        `Media: unknown upload-error received from Media Picker: ${error &&
          error.name}`,
      );
      const errorReporter = options.errorReporter || new ErrorReporter();
      errorReporter.captureException(err);
      return;
    }
  };

  render() {
    const { context, uploadParams } = this.state;

    if (!context || !uploadParams) {
      return null;
    }
    const config = {
      uploadParams,
    };
    return (
      <Clipboard
        context={context}
        config={config}
        onError={this.onError}
        onPreviewUpdate={this.onPreviewUpdate}
      />
    );
  }
}
