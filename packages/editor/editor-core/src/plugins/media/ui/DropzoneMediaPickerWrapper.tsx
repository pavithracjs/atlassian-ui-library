import * as React from 'react';
import { MediaPluginState, MediaProvider } from '../pm-plugins/main';
import { Dropzone, DropzoneConfig } from '@atlaskit/media-picker';
import { Context } from '@atlaskit/media-core';
import { ErrorReporter } from '@atlaskit/editor-common';
import PickerFacade from '../picker-facade';
import { CustomMediaPicker } from '../types';

const dummyMediaPickerObject: CustomMediaPicker = {
  on: () => {},
  removeAllListeners: () => {},
  emit: () => {},
  destroy: () => {},
  setUploadParams: () => {},
};

type Props = {
  mediaState: MediaPluginState;
};

type State = {
  config?: DropzoneConfig;
  context?: Context;
  pickerFacadeInstance?: PickerFacade;
};

export class DropzoneMediaPickerWrapper extends React.Component<Props, State> {
  state: State = {};

  private handleMediaProvider = async (
    name: any,
    provider?: Promise<MediaProvider>,
  ) => {
    const { mediaState } = this.props;
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
      errorReporter: mediaState.options.errorReporter || new ErrorReporter(),
    };

    const pickerFacadeInstance = await new PickerFacade(
      'customMediaPicker',
      pickerFacadeConfig,
      dummyMediaPickerObject,
    ).init();

    pickerFacadeInstance.onNewMedia(mediaState.insertFile);
    pickerFacadeInstance.onNewMedia(mediaState.trackNewMediaEvent('dropzone'));
    pickerFacadeInstance.setUploadParams(mediaProvider.uploadParams);

    const config = {
      uploadParams: mediaProvider.uploadParams,
    };

    this.setState({
      pickerFacadeInstance,
      config,
      context,
    });
  };

  componentDidMount() {
    this.props.mediaState.options.providerFactory.subscribe(
      'mediaProvider',
      this.handleMediaProvider,
    );
  }

  componentWillUnmount() {
    this.props.mediaState.options.providerFactory.unsubscribe(
      'mediaProvider',
      this.handleMediaProvider,
    );
  }

  private onDragEnter = () => {
    const {
      mediaState: { handleDrag },
    } = this.props;
    handleDrag('enter');
  };

  private onDragLeave = () => {
    const {
      mediaState: { handleDrag },
    } = this.props;
    handleDrag('leave');
  };

  render() {
    const {
      mediaState: {
        options: { customDropzoneContainer },
      },
    } = this.props;
    const { context, config, pickerFacadeInstance } = this.state;

    if (!context || !config || !pickerFacadeInstance) {
      return null;
    }
    // Not quite sure where the container is coming from. Will try both:
    const theConfig: DropzoneConfig = {
      ...config,
      container: config.container || customDropzoneContainer,
    };

    return (
      <Dropzone
        context={context}
        config={theConfig}
        onError={pickerFacadeInstance.handleUploadError}
        onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
        onProcessing={pickerFacadeInstance.handleReady}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
      />
    );
  }
}
