import * as React from 'react';
import { colors } from '@atlaskit/theme';
import { ModalSpinner } from '@atlaskit/media-ui';
import { WithContextOrMediaClientConfigProps } from '@atlaskit/media-client';
import { MediaViewer } from './media-viewer';
import { MediaViewerProps } from './types';

type MediaViewerWithMediaClientConfigProps = WithContextOrMediaClientConfigProps<
  MediaViewerProps
>;

type CardWithMediaClientConfigComponent = React.ComponentType<
  MediaViewerWithMediaClientConfigProps
>;

interface AsyncMediaViewerState {
  MediaViewer?: CardWithMediaClientConfigComponent;
}

export default class AsyncMediaViewer extends React.PureComponent<
  MediaViewerWithMediaClientConfigProps & AsyncMediaViewerState,
  AsyncMediaViewerState
> {
  static displayName = 'AsyncMediaViewer';
  static MediaViewer?: CardWithMediaClientConfigComponent;

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

      AsyncMediaViewer.MediaViewer = mediaClient.withMediaClient(
        mediaViewerModule.MediaViewer,
      );
      this.setState({ MediaViewer: mediaViewerModule.MediaViewer });
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
