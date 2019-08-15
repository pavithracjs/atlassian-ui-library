import * as React from 'react';
import { WithContextOrMediaClientConfigProps } from '@atlaskit/media-client';

import { DropzoneProps } from './dropzone';
import MediaPickerAnalyticsErrorBoundary from '../media-picker-analytics-error-boundary';

export type DropzoneWithMediaClientConfigProps = WithContextOrMediaClientConfigProps<
  DropzoneProps
>;
type DropzoneWithMediaClientConfigComponent = React.ComponentType<
  DropzoneWithMediaClientConfigProps
>;

export type State = {
  Dropzone?: DropzoneWithMediaClientConfigComponent;
};

export class DropzoneLoader extends React.PureComponent<
  DropzoneWithMediaClientConfigProps,
  State
> {
  static displayName = 'AsyncDropzone';
  static Dropzone?: DropzoneWithMediaClientConfigComponent;

  state = { Dropzone: DropzoneLoader.Dropzone };

  async componentWillMount() {
    if (!this.state.Dropzone) {
      try {
        const [mediaClient, dropzoneModule] = await Promise.all([
          import(/* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
          import(/* webpackChunkName:"@atlaskit-internal_Dropzone" */ './dropzone'),
        ]);

        DropzoneLoader.Dropzone = mediaClient.withMediaClient(
          dropzoneModule.Dropzone,
        );

        this.setState({
          Dropzone: DropzoneLoader.Dropzone,
        });
      } catch (error) {
        // TODO [MS-2272]: Add operational error to catch async import error
      }
    }
  }

  render() {
    if (!this.state.Dropzone) {
      return null;
    }

    return (
      <MediaPickerAnalyticsErrorBoundary>
        <this.state.Dropzone {...this.props} />
      </MediaPickerAnalyticsErrorBoundary>
    );
  }
}
