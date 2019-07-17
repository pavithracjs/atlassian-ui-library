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
  triggerActivityCallback?: () => void;
}

export class Content extends Component<ContentProps, ContentState> {
  state: ContentState = {};

  render() {
    const { onClose } = this.props;
    const { triggerActivityCallback } = this.state;

    const children = React.cloneElement(this.props.children, {
      showControls: triggerActivityCallback,
    });

    // Here we get called by InactivityDetector and given a function we pass down as "showControls"
    // to out children.
    const triggerActivityCallbackRequester = (
      triggerActivityCallback: () => void,
    ) => {
      this.setState({ triggerActivityCallback });
    };

    return (
      <InactivityDetector
        triggerActivityCallbackRequester={triggerActivityCallbackRequester}
      >
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
