import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import LinkFilledIcon from '@atlaskit/icon/glyph/link-filled';
import InlineDialog from '@atlaskit/inline-dialog';
import { colors } from '@atlaskit/theme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import Button from './styles';
import { messages } from '../i18n';

const AUTO_DISMISS_SECONDS = 8;

export const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  margin: -8px -16px;
`;

const MessageSpan = styled.span`
  text-indent: 6px;
`;

type InputProps = {
  ref?: React.RefObject<HTMLInputElement>;
  text: string;
};

export const HiddenInput: React.ComponentType<InputProps> = React.forwardRef(
  (props: { text: string }, ref?: React.Ref<HTMLInputElement>) => (
    <input
      style={{ position: 'absolute', left: '-9999px' }}
      ref={ref}
      value={props.text}
      readOnly
    />
  ),
);

export type Props = {
  onLinkCopy?: (link: string) => void;
  link: string;
};

export type State = {
  shouldShowCopiedMessage: boolean;
};

export const AUTO_DISMISS_MS = AUTO_DISMISS_SECONDS * 1000;

export class CopyLinkButton extends React.Component<Props, State> {
  private autoDismiss: number | undefined;
  private inputRef: React.RefObject<HTMLInputElement> = React.createRef();

  state = {
    shouldShowCopiedMessage: false,
  };

  componentWillUnmount() {
    this.clearAutoDismiss();
  }

  private clearAutoDismiss = () => {
    if (this.autoDismiss && window) {
      window.clearTimeout(this.autoDismiss);
      this.autoDismiss = undefined;
    }
  };

  private handleClick = () => {
    if (this.inputRef.current) {
      this.inputRef.current!.select();
    }
    document.execCommand('copy');

    if (this.props.onLinkCopy) {
      this.props.onLinkCopy!(this.props.link);
    }

    this.setState({ shouldShowCopiedMessage: true }, () => {
      this.clearAutoDismiss();
      this.autoDismiss =
        window &&
        window.setTimeout(() => {
          this.setState({ shouldShowCopiedMessage: false });
        }, AUTO_DISMISS_SECONDS * 1000);
    });
  };

  private handleDismissCopiedMessage = () => {
    this.clearAutoDismiss();
    this.setState({ shouldShowCopiedMessage: false });
  };

  render() {
    const { shouldShowCopiedMessage } = this.state;

    return (
      <>
        <HiddenInput ref={this.inputRef} text={this.props.link} />
        <InlineDialog
          content={
            <MessageContainer>
              <CheckCircleIcon
                label="check circle icon"
                primaryColor={colors.G300}
              />
              <MessageSpan>
                <FormattedMessage {...messages.copiedToClipboardMessage} />
              </MessageSpan>
            </MessageContainer>
          }
          isOpen={shouldShowCopiedMessage}
          onClose={this.handleDismissCopiedMessage}
          placement="top-start"
        >
          <Button
            appearance="subtle-link"
            iconBefore={<LinkFilledIcon label="copy link icon" size="medium" />}
            onClick={this.handleClick}
          >
            <FormattedMessage {...messages.copyLinkButtonText} />
          </Button>
        </InlineDialog>
      </>
    );
  }
}
