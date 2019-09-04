import * as React from 'react';
import { WithContextOrMediaClientConfigProps } from '@atlaskit/media-client';

import { DropzoneProps } from './dropzone';
import { MediaPickerAnalyticsErrorBoundaryProps } from '../media-picker-analytics-error-boundary';

export type DropzoneWithMediaClientConfigProps = WithContextOrMediaClientConfigProps<
  DropzoneProps
>;
type DropzoneWithMediaClientConfigComponent = React.ComponentType<
  DropzoneWithMediaClientConfigProps
>;

type MediaPickerErrorBoundaryComponent = React.ComponentType<
  MediaPickerAnalyticsErrorBoundaryProps
>;

export type State = {
  Dropzone?: DropzoneWithMediaClientConfigComponent;
  MediaPickerErrorBoundary?: MediaPickerErrorBoundaryComponent;
};

export class DropzoneLoader extends React.PureComponent<
  DropzoneWithMediaClientConfigProps,
  State
> {
  static displayName = 'AsyncDropzone';
  static Dropzone?: DropzoneWithMediaClientConfigComponent;
  static MediaPickerErrorBoundary?: MediaPickerErrorBoundaryComponent;

  state = {
    Dropzone: DropzoneLoader.Dropzone,
    MediaPickerErrorBoundary: DropzoneLoader.MediaPickerErrorBoundary,
  };

  async UNSAFE_componentWillMount() {
    if (!this.state.Dropzone || !this.state.MediaPickerErrorBoundary) {
      try {
        const [
          mediaClient,
          dropzoneModule,
          mediaPickerErrorBoundaryModule,
        ] = await Promise.all([
          import(/* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
          import(/* webpackChunkName:"@atlaskit-internal_Dropzone" */ './dropzone'),
          import(/* webpackChunkName:"@atlaskit-internal_MediaPickerErrorBoundary" */ '../media-picker-analytics-error-boundary'),
        ]);

        DropzoneLoader.Dropzone = mediaClient.withMediaClient(
          dropzoneModule.Dropzone,
        );

        this.setState({
          Dropzone: DropzoneLoader.Dropzone,
          MediaPickerErrorBoundary: mediaPickerErrorBoundaryModule.default,
        });
      } catch (error) {
        // TODO [MS-2272]: Add operational error to catch async import error
      }
    }
  }

  render() {
    if (!this.state.Dropzone || !this.state.MediaPickerErrorBoundary) {
      return null;
    }

    return (
      <this.state.MediaPickerErrorBoundary>
        <this.state.Dropzone {...this.props} />
      </this.state.MediaPickerErrorBoundary>
    );
  }
}
