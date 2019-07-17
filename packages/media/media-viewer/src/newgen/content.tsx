import * as React from 'react';
import { Component, ReactElement } from 'react';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import {
  MediaButton,
  hideControlsClassName,
  InactivityDetector,
} from '@atlaskit/media-ui';
import { CloseButtonWrapper } from './styled';
import { WithShowControlMethodProp } from '@atlaskit/media-ui';

export interface ContentProps {
  onClose?: () => void;
  children: ReactElement<WithShowControlMethodProp>;
}

export interface ContentState {
  functionInactivityDetectorWhatUsToCall?: () => void;
}

export class Content extends Component<ContentProps, ContentState> {
  state: ContentState = {};

  render() {
    const { onClose } = this.props;
    // We extend the children with the ability of showing the controls
    const { functionInactivityDetectorWhatUsToCall } = this.state;

    const children = React.cloneElement(this.props.children, {
      showControls: functionInactivityDetectorWhatUsToCall,
    });

    const someCallback = (
      functionInactivityDetectorWhatUsToCall: () => void,
    ) => {
      this.setState({ functionInactivityDetectorWhatUsToCall });
    };

    return (
      <InactivityDetector showControlsRegister={someCallback}>
        <CloseButtonWrapper className={hideControlsClassName}>
          <MediaButton
            appearance={'toolbar' as any}
            onClick={onClose}
            iconBefore={<CrossIcon label="Close" />}
          />
        </CloseButtonWrapper>
        {children}
      </InactivityDetector>
    );
  }
}
