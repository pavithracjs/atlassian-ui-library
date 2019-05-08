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
  UploadsStartEventPayload,
} from '@atlaskit/media-picker';
import { Context, FileIdentifier } from '@atlaskit/media-core';
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

export default class CustomSmartMediaEditor extends React.Component<
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
      console.log('listener', listener);
    };
    mediaState.insertFile(state, cb);
  };

  onUploadStart = () => {
    console.log('onUploadStart');
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
        onUploadsStart={this.onUploadStart}
        onEnd={() => {
          console.log('onEnd');
        }}
        onError={() => {
          console.log('onError');
        }}
        onPreviewUpdate={this.onPreviewUpdate}
      />
    );
  }
}
