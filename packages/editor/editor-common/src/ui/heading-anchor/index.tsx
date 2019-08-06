import React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import messages from './messages';
import { HeadingAnchorWrapperClassName } from './heading-anchor-wrapper';

const HeadingComponentWithAnchor = styled.div`
  & .${HeadingAnchorWrapperClassName} button {
    opacity: 0;
    transform: translate(8px, 0px);
    transition: opacity 0.2s ease 0s, transform 0.2s ease 0s;
    width: 0;
  }

  &:hover {
    & .${HeadingAnchorWrapperClassName} button {
      opacity: 1;
      transform: none;
      width: unset;
    }
  }
`;

export const HeadingComponents: {
  [key: string]: StyledComponentClass<any, any, any>;
} = {
  h1: HeadingComponentWithAnchor.withComponent('h1'),
  h2: HeadingComponentWithAnchor.withComponent('h2'),
  h3: HeadingComponentWithAnchor.withComponent('h3'),
  h4: HeadingComponentWithAnchor.withComponent('h4'),
  h5: HeadingComponentWithAnchor.withComponent('h5'),
  h6: HeadingComponentWithAnchor.withComponent('h6'),
};

const CopyAnchorWrapper = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  overflow: hidden;
  right: 0;
  width: 32px;
  height: 100%;
`;

const CopyAnchor = styled.button`
  outline: none;
  background-color: transparent;
  border: none;
  color: ${colors.N500};
  cursor: pointer;
  right: 0;
  height: 100%;
`;

class HeadingAnchor extends React.PureComponent<
  { onClick: () => Promise<void> } & React.Props<any> & InjectedIntlProps
> {
  initialTooltipMessage = this.props.intl.formatMessage(
    messages.copyHeadingLinkToClipboard,
  );

  state = {
    tooltipMessage: this.initialTooltipMessage,
  };

  copyToClipboard = async () => {
    // This is needed to reset tooltip to reposition it.
    // Might be better to fix tooltip reposition bug.
    this.setState({ tooltipMessage: '' });

    try {
      await this.props.onClick();
      this.setState({
        tooltipMessage: this.props.intl.formatMessage(
          messages.copiedHeadingLinkToClipboard,
        ),
      });
    } catch (e) {
      this.setState({
        tooltipMessage: this.props.intl.formatMessage(
          messages.failedToCopyHeadingLink,
        ),
      });
    }
  };

  resetMessage = () => {
    setTimeout(() => {
      this.setState({ tooltipMessage: this.initialTooltipMessage });
    }, 0);
  };

  renderAnchor() {
    return (
      <CopyAnchor
        onMouseLeave={this.resetMessage}
        onClick={this.copyToClipboard}
      >
        <LinkIcon label="copy" size="small" />
      </CopyAnchor>
    );
  }

  render() {
    return (
      <CopyAnchorWrapper>
        {this.state.tooltipMessage ? (
          <Tooltip content={this.state.tooltipMessage} position="top" delay={0}>
            {this.renderAnchor()}
          </Tooltip>
        ) : (
          <div>{this.renderAnchor()}</div>
        )}
      </CopyAnchorWrapper>
    );
  }
}

export default injectIntl(HeadingAnchor);
export {
  HeadingAnchorWrapperClassName,
  HeadingAnchorWrapper,
} from './heading-anchor-wrapper';
