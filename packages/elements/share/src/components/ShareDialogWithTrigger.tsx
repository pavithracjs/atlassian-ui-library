import { ButtonAppearances } from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import { LoadOptions } from '@atlaskit/user-picker';
import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';
import { messages } from '../i18n';
import {
  ConfigResponse,
  DialogContentState,
  Flag,
  ShareButtonStyle,
  ADMIN_NOTIFIED,
  OBJECT_SHARED,
} from '../types';
import { ShareButton } from './ShareButton';
import { ShareForm } from './ShareForm';

type RenderChildren = (
  args: { onClick: () => void; loading: boolean; error?: ShareError },
) => React.ReactNode;

type DialogState = {
  isDialogOpen: boolean;
  isSharing: boolean;
  shareError?: ShareError;
  ignoreIntermediateState: boolean;
  defaultValue: DialogContentState;
};

export type State = DialogState;

type ShareError = {
  message: string;
};

export type Props = {
  buttonStyle?: ShareButtonStyle;
  config?: ConfigResponse;
  children?: RenderChildren;
  copyLink: string;
  dialogPlacement?: string;
  isDisabled?: boolean;
  loadUserOptions?: LoadOptions;
  onLinkCopy?: Function;
  onShareSubmit?: (shareContentState: DialogContentState) => Promise<any>;
  shareContentType: string;
  shareFormTitle?: React.ReactNode;
  shouldCloseOnEscapePress?: boolean;
  showFlags: (flags: Array<Flag>) => void;
  triggerButtonAppearance?: ButtonAppearances;
  triggerButtonStyle?: ShareButtonStyle;
};

const InlineDialogFormWrapper = styled.div`
  width: 352px;
`;

export const defaultShareContentState: DialogContentState = {
  users: [],
  comment: {
    format: 'plain_text' as 'plain_text',
    value: '',
  },
};

export class Component extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  static defaultProps = {
    isDisabled: false,
    dialogPlacement: 'bottom-end',
    shouldCloseOnEscapePress: false,
    triggerButtonAppearance: 'subtle' as 'subtle',
    triggerButtonStyle: 'icon-only' as 'icon-only',
  };
  private containerRef = React.createRef<HTMLDivElement>();

  escapeIsHeldDown: boolean = false;

  state: State = {
    isDialogOpen: false,
    isSharing: false,
    ignoreIntermediateState: false,
    defaultValue: defaultShareContentState,
  };

  private getFlags = () => {
    const { formatMessage } = this.props.intl;
    const flags: Array<Flag> = [];

    if (
      this.props.config &&
      this.props.config.mode === 'INVITE_NEEDS_APPROVAL'
    ) {
      flags.push({
        id: `${ADMIN_NOTIFIED}-${Date.now()}`,
        type: ADMIN_NOTIFIED,
        localizedTitle: formatMessage(messages.adminNotifiedMessage),
      });
    }

    flags.push({
      id: `${OBJECT_SHARED}-${Date.now()}`,
      type: OBJECT_SHARED,
      localizedTitle: formatMessage(messages.shareSuccessMessage, {
        object: this.props.shareContentType.toLowerCase(),
      }),
    });

    // The reason for providing the both type and localizedTitle is that
    // in jira, the Flag system takes only Message Descriptor as payload
    // and formatMessage is called for every flag
    return flags;
  };

  private handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { isDialogOpen } = this.state;
    if (isDialogOpen) {
      switch (event.key) {
        case 'Escape':
          event.stopPropagation();
          this.setState({
            isDialogOpen: false,
            ignoreIntermediateState: true,
            defaultValue: defaultShareContentState,
            shareError: undefined,
          });
      }
    }
  };

  private onTriggerClick = () => {
    // TODO: send analytics
    this.setState(
      {
        isDialogOpen: !this.state.isDialogOpen,
        ignoreIntermediateState: false,
      },
      () => {
        if (this.containerRef.current) {
          this.containerRef.current.focus();
        }
      },
    );
  };

  private handleCloseDialog = (_: { isOpen: boolean; event: any }) => {
    // TODO: send analytics
    this.setState({
      isDialogOpen: false,
    });
  };

  private handleShareSubmit = (data: DialogContentState) => {
    if (!this.props.onShareSubmit) {
      return;
    }

    this.setState({ isSharing: true });

    this.props
      .onShareSubmit(data)
      .then(() => {
        this.handleCloseDialog({ isOpen: false, event: {} });
        this.props.showFlags(this.getFlags());
      })
      .catch((err: Error) => {
        this.setState({
          isSharing: false,
          shareError: {
            message: err.message,
          },
        });
        // send analytic event about the err
      });
  };

  private handleFormDismiss = (data: DialogContentState) => {
    this.setState(({ ignoreIntermediateState }) =>
      ignoreIntermediateState ? null : { defaultValue: data },
    );
  };

  render() {
    const { isDialogOpen, isSharing, shareError, defaultValue } = this.state;
    const {
      copyLink,
      dialogPlacement,
      isDisabled,
      loadUserOptions,
      shareFormTitle,
      config,
      triggerButtonAppearance,
      triggerButtonStyle,
    } = this.props;

    // for performance purposes, we may want to have a lodable content i.e. ShareForm
    return (
      <div
        tabIndex={0}
        onKeyDown={this.handleKeyDown}
        style={{ outline: 'none' }}
        ref={this.containerRef}
      >
        <InlineDialog
          content={
            <InlineDialogFormWrapper>
              <ShareForm
                copyLink={copyLink}
                loadOptions={loadUserOptions}
                isSharing={isSharing}
                onShareClick={this.handleShareSubmit}
                title={shareFormTitle}
                shareError={shareError}
                onDismiss={this.handleFormDismiss}
                defaultValue={defaultValue}
                config={config}
              />
            </InlineDialogFormWrapper>
          }
          isOpen={isDialogOpen}
          onClose={this.handleCloseDialog}
          placement={dialogPlacement}
        >
          {this.props.children ? (
            this.props.children({
              onClick: this.onTriggerClick,
              loading: isSharing,
              error: shareError,
            })
          ) : (
            <ShareButton
              appearance={triggerButtonAppearance}
              text={
                triggerButtonStyle === 'icon-with-text' ? (
                  <FormattedMessage {...messages.shareTriggerButtonText} />
                ) : null
              }
              onClick={this.onTriggerClick}
              isSelected={isDialogOpen}
              isDisabled={isDisabled}
            />
          )}
        </InlineDialog>
      </div>
    );
  }
}

export const ShareDialogWithTrigger = injectIntl(Component);
