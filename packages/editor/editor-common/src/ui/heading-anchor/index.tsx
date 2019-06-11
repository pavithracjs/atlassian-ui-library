import React from 'react';
import styled, { StyledComponentClass } from 'styled-components';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import messages from './messages';

const HeadingComponentWithAnchor = styled.div`
  & .heading-anchor button {
    opacity: 0;
    transform: translate(8px, 0px);
    transition: opacity 0.2s ease 0s, transform 0.2s ease 0s;
    width: 0;
  }

  &:hover {
    & .heading-anchor button {
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
  background-color: white;
  border: none;
  color: ${colors.N500};
  cursor: pointer;
  right: 0;
  height: 100%;
`;

class HeadingAnchor extends React.PureComponent<
  { onClick: () => Promise<void> } & React.Props<any> & InjectedIntlProps
> {
  initialCopyMessage = this.props.intl.formatMessage(
    messages.copyHeadingLinkToClipboard,
  );

  state = {
    copySuccess: this.initialCopyMessage,
  };

  copyToClipboard = async () => {
    this.setState({ copySuccess: '' });

    try {
      await this.props.onClick();
      this.setState({
        copySuccess: this.props.intl.formatMessage(
          messages.copiedHeadingLinkToClipboard,
        ),
      });
    } catch (e) {
      this.setState({
        copySuccess: this.props.intl.formatMessage(
          messages.failedToCopyHeadingLink,
        ),
      });
    }
  };

  resetMessage = () => {
    setTimeout(() => {
      this.setState({ copySuccess: this.initialCopyMessage });
    }, 0);
  };

  renderAnchor() {
    return (
      <CopyAnchor
        className="copy-anchor"
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
        {this.state.copySuccess ? (
          <Tooltip content={this.state.copySuccess} position="top" delay={0}>
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
