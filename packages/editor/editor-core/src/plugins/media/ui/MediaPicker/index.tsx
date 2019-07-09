import React from 'react';
import { MediaPluginState } from '../../pm-plugins/main';
import { ClipboardWrapper } from './ClipboardWrapper';
import { DropzoneWrapper } from './DropzoneWrapper';
import { BrowserWrapper } from './BrowserWrapper';

type Props = {
  mediaState: MediaPluginState;
};

type State = {
  isPopupOpened: boolean;
};

export class MediaPickerComponents extends React.Component<Props, State> {
  state = {
    isPopupOpened: false,
  };

  componentDidMount() {
    const { mediaState } = this.props;
    mediaState.onPopupToggle(isPopupOpened => {
      this.setState({
        isPopupOpened,
      });
    });
  }

  onBrowseFn = (nativeBrowseFn: () => void) => {
    const { mediaState } = this.props;
    mediaState && mediaState.setBrowseFn(nativeBrowseFn);
  };

  render() {
    const { mediaState } = this.props;
    const { isPopupOpened } = this.state;
    return (
      <>
        <ClipboardWrapper mediaState={mediaState} />
        <DropzoneWrapper mediaState={mediaState} isActive={!isPopupOpened} />
        {!mediaState.hasUserAuthProvider() && (
          <BrowserWrapper
            onBrowseFn={this.onBrowseFn}
            mediaState={mediaState}
          />
        )}
      </>
    );
  }
}
