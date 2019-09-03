import * as React from 'react';
import { ClipboardProps } from './clipboard';
import { WithContextOrMediaClientConfigProps } from '@atlaskit/media-client';

type ClipboardWithMediaClientConfigProps = WithContextOrMediaClientConfigProps<
  ClipboardProps
>;
type ClipboardWithMediaClientConfigComponent = React.ComponentType<
  ClipboardWithMediaClientConfigProps
>;

type State = {
  Clipboard?: ClipboardWithMediaClientConfigComponent;
};

export class ClipboardLoader extends React.PureComponent<
  ClipboardWithMediaClientConfigProps,
  State
> {
  static displayName = 'AsyncClipboard';
  static Clipboard?: ClipboardWithMediaClientConfigComponent;

  state = {
    Clipboard: ClipboardLoader.Clipboard,
  };

  async UNSAFE_componentWillMount() {
    if (!this.state.Clipboard) {
      const [mediaClient, clipboardModule] = await Promise.all([
        import(/* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
        import(/* webpackChunkName:"@atlaskit-internal_Clipboard" */ './clipboard'),
      ]);

      ClipboardLoader.Clipboard = mediaClient.withMediaClient(
        clipboardModule.Clipboard,
      );

      this.setState({
        Clipboard: ClipboardLoader.Clipboard,
      });
    }
  }

  render() {
    if (!this.state.Clipboard) {
      return null;
    }

    return <this.state.Clipboard {...this.props} />;
  }
}
