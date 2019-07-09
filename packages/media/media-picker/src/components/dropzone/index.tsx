import * as React from 'react';
import { DropzoneProps } from './dropzone';
import { WithContextOrMediaClientConfigProps } from '@atlaskit/media-client';

type DropzoneWithMediaClientConfigProps = WithContextOrMediaClientConfigProps<
  DropzoneProps
>;
type DropzoneWithMediaClientConfigComponent = React.ComponentType<
  DropzoneWithMediaClientConfigProps
>;

type State = {
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
    }
  }

  render() {
    if (!this.state.Dropzone) {
      return null;
    }

    return <this.state.Dropzone {...this.props} />;
  }
}
