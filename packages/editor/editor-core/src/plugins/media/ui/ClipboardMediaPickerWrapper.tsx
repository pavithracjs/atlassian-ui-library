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
import { CustomMediaPicker } from '../types';

type Props = {
  mediaState: MediaPluginState;
};

type State = {
  uploadParams?: UploadParams;
  context?: Context;
  onMediaStateChangedCallback: MediaStateEventListener;
};

class DummyMediaPicker implements CustomMediaPicker {
  on(event: string, cb: import('../types').Listener): void {}

  removeAllListeners(event: any): void {}
  emit(event: string, data: any): void {}
  destroy(): void {}
  setUploadParams(uploadParams: UploadParams): void {}
}

export default class ClipboardMediaPickerWrapper extends React.Component<
  Props,
  State
> {
  state: State = {};

  componentDidMount() {
    const { mediaState } = this.props;
    mediaState.options.providerFactory.subscribe(
      'mediaProvider',
      async (name, provider?: Promise<MediaProvider>) => {
        const mediaProvider = await provider;
        if (!mediaProvider || !mediaProvider.uploadParams) {
          throw new Error('no media provider');
        }

        const context = await mediaProvider.uploadContext;
        if (!context) {
          throw new Error('no context');
        }
        const pickerFacadeConfig = {
          context,
          errorReporter:
            mediaState.options.errorReporter || new ErrorReporter(),
        };

        const config = {
          uploadParams: mediaProvider.uploadParams,
        };

        const pickerFacadeInstance = await new PickerFacade(
          'customMediaPicker',
          pickerFacadeConfig,
          new DummyMediaPicker(),
        ).init();

        pickerFacadeInstance.onNewMedia(mediaState.insertFile);
        pickerFacadeInstance.setUploadParams(mediaProvider.uploadParams);

        this.setState({
          pickerFacadeInstance,
          config,
          context,
        });
      },
    );
  }

  // onPreviewUpdate = (event: UploadPreviewUpdateEventPayload) => {
  //   const {
  //     mediaState: { insertFile },
  //   } = this.props;
  //   const { preview, file } = event;

  //   const { dimensions, scaleFactor } = isImagePreview(preview)
  //     ? preview
  //     : { dimensions: undefined, scaleFactor: undefined };

  //   const state = {
  //     id: file.id,
  //     fileName: file.name,
  //     fileSize: file.size,
  //     fileMimeType: file.type,
  //     dimensions,
  //     scaleFactor,
  //   };

  //   insertFile(state, onMediaStateChangedCallback => {
  //     this.setState({
  //       onMediaStateChangedCallback,
  //     });
  //   });
  // };

  // onError = ({ file, error }: UploadErrorEventPayload) => {
  //   const {
  //     mediaState: { options },
  //   } = this.props;
  //   if (!error || !error.fileId) {
  //     const err = new Error(
  //       `Media: unknown upload-error received from Media Picker: ${error &&
  //         error.name}`,
  //     );
  //     const errorReporter = options.errorReporter || new ErrorReporter();
  //     errorReporter.captureException(err);
  //     return;
  //   }

  //   this.state.onMediaStateChangedCallback({
  //     id: error.fileId!,
  //     status: 'error',
  //     error: error && { description: error.description, name: error.name },
  //   });
  // };

  // onProcessing = ({ file }: UploadProcessingEventPayload) => {
  //   this.state.onMediaStateChangedCallback({
  //     id: file.id,
  //     status: 'ready',
  //   });
  // };

  render() {
    const { context, config, pickerFacadeInstance } = this.state;

    if (!context || !config) {
      return null;
    }

    return (
      <Clipboard
        context={context}
        config={config}
        onError={pickerFacadeInstance.handleUploadError}
        onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
        onProcessing={pickerFacadeInstance.handleReady}
      />
    );
  }
}
