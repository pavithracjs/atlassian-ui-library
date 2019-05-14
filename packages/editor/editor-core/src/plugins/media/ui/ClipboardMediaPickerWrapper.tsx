import * as React from 'react';
import { MediaPluginState, MediaProvider } from '../pm-plugins/main';
import { Clipboard, ClipboardConfig } from '@atlaskit/media-picker';
import { Context } from '@atlaskit/media-core';
import { ErrorReporter } from '@atlaskit/editor-common';
import PickerFacade from '../picker-facade';
import { CustomMediaPicker } from '../types';

type Props = {
  mediaState: MediaPluginState;
};

type State = {
  config?: ClipboardConfig;
  context?: Context;
  pickerFacadeInstance?: PickerFacade;
};

const dummyMediaPickerObject: CustomMediaPicker = {
  on: () => {},
  removeAllListeners: () => {},
  emit: () => {},
  destroy: () => {},
  setUploadParams: () => {},
};

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
          return;
        }

        const context = await mediaProvider.uploadContext;

        if (!context) {
          return;
        }

        const pickerFacadeConfig = {
          context,
          errorReporter:
            mediaState.options.errorReporter || new ErrorReporter(),
        };

        const pickerFacadeInstance = await new PickerFacade(
          'customMediaPicker',
          pickerFacadeConfig,
          dummyMediaPickerObject,
        ).init();

        pickerFacadeInstance.onNewMedia(mediaState.insertFile);
        pickerFacadeInstance.setUploadParams(mediaProvider.uploadParams);

        const config = {
          uploadParams: mediaProvider.uploadParams,
        };
        this.setState({
          pickerFacadeInstance,
          config,
          context,
        });
      },
    );
  }

  render() {
    const { context, config, pickerFacadeInstance } = this.state;

    if (!context || !config || !pickerFacadeInstance) {
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
