import * as React from 'react';
import { MediaPluginState, MediaProvider } from '../pm-plugins/main';
import {
  Clipboard,
  UploadPreviewUpdateEventPayload,
  UploadParams,
  UploadErrorEventPayload,
  UploadProcessingEventPayload,
  isImagePreview,
} from '@atlaskit/media-picker';
import { Context } from '@atlaskit/media-core';
import { ErrorReporter } from '@atlaskit/editor-common';
import PickerFacade, { MediaStateEventListener } from '../picker-facade';

type Props = {
  mediaState: MediaPluginState;
};

type State = {
  uploadParams?: UploadParams;
  context?: Context;
  onMediaStateChangedCallback: MediaStateEventListener;
};

export default class ClipboardMediaPickerWrapper extends React.Component<
  Props,
  State
> {
  state: State = {
    onMediaStateChangedCallback: () => {},
  };

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
    const {
      mediaState: { insertFile },
    } = this.props;
    const { preview, file } = event;

    const { dimensions, scaleFactor } = isImagePreview(preview)
      ? preview
      : { dimensions: undefined, scaleFactor: undefined };

    const state = {
      id: file.id,
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type,
      dimensions,
      scaleFactor,
    };

    insertFile(state, onMediaStateChangedCallback => {
      this.setState({
        onMediaStateChangedCallback,
      });
    });
  };

  onError = ({ file, error }: UploadErrorEventPayload) => {
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

    this.state.onMediaStateChangedCallback({
      id: error.fileId!,
      status: 'error',
      error: error && { description: error.description, name: error.name },
    });
  };

  onProcessing = ({ file }: UploadProcessingEventPayload) => {
    this.state.onMediaStateChangedCallback({
      id: file.id,
      status: 'ready',
    });
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
        onProcessing={this.onProcessing}
      />
    );
  }
}
