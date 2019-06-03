import * as React from 'react';
import { colors } from '@atlaskit/theme';
import { ModalSpinner } from '@atlaskit/media-ui';
import { WithContextOrMediaClientConfigProps } from '@atlaskit/media-client';
import { MediaViewerProps } from './types';

type MediaViewerWithContextMediaClientConfigProps = WithContextOrMediaClientConfigProps<
  MediaViewerProps
>;

type MediaViewerWithMediaClientConfigComponent = React.ComponentType<
  MediaViewerWithContextMediaClientConfigProps
>;

interface AsyncMediaViewerState {
  MediaViewer?: MediaViewerWithMediaClientConfigComponent;
}

export default class AsyncMediaViewer extends React.PureComponent<
  MediaViewerWithContextMediaClientConfigProps & AsyncMediaViewerState,
  AsyncMediaViewerState
> {
  static displayName = 'AsyncMediaViewer';
  static MediaViewer?: MediaViewerWithMediaClientConfigComponent;

  state: AsyncMediaViewerState = {
    // Set state value to equal to current static value of this class.
    MediaViewer: AsyncMediaViewer.MediaViewer,
  };

  async componentWillMount() {
    if (!this.state.MediaViewer) {
      const [mediaClient, mediaViewerModule] = await Promise.all([
        import(/* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
        import(/* webpackChunkName:"@atlaskit-internal_media-viewer" */ './media-viewer'),
      ]);

      const MediaViewerWithClient = mediaClient.withMediaClient(
        mediaViewerModule.MediaViewer,
      );
      AsyncMediaViewer.MediaViewer = MediaViewerWithClient;
      this.setState({ MediaViewer: MediaViewerWithClient });
    }
  }

  render() {
    if (!this.state.MediaViewer) {
      return (
        <ModalSpinner blankedColor={colors.DN30} invertSpinnerColor={true} />
      );
    }

    return <this.state.MediaViewer {...this.props} />;
  }
}
