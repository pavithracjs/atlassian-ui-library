import {
  AnalyticsContext,
  withAnalyticsEvents,
  AnalyticsEventPayload,
  WithAnalyticsEventProps,
} from '@atlaskit/analytics-next';
import { ButtonAppearances } from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import { LoadOptions } from '@atlaskit/user-picker';
import ShareIcon from '@atlaskit/icon/glyph/share';
import * as React from 'react';
import { FormattedMessage, injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';
import { messages } from '../i18n';
import {
  ConfigResponse,
  DialogContentState,
  DialogPlacement,
  Flag,
  OriginTracing,
  ShareButtonStyle,
  ShareError,
  RenderCustomTriggerButton,
  ADMIN_NOTIFIED,
  OBJECT_SHARED,
} from '../types';
import {
  buttonClicked,
  cancelShare,
  copyShareLink,
  screenEvent,
  submitShare,
} from './analytics';
import ShareButton from './ShareButton';
import { ShareForm } from './ShareForm';
import { showInviteWarning } from './utils';

type DialogState = {
  isDialogOpen: boolean;
  isSharing: boolean;
  shareError?: ShareError;
  ignoreIntermediateState: boolean;
  defaultValue: DialogContentState;
};

export type State = DialogState;

export type Props = {
  config?: ConfigResponse;
  children?: RenderCustomTriggerButton;
  copyLink: string;
  dialogPlacement?: DialogPlacement;
  fetchConfig: Function;
  isDisabled?: boolean;
  isFetchingConfig?: boolean;
  loadUserOptions?: LoadOptions;
  onLinkCopy?: Function;
  onShareSubmit?: (shareContentState: DialogContentState) => Promise<any>;
  renderCustomTriggerButton?: RenderCustomTriggerButton;
  shareContentType: string;
  shareFormTitle?: React.ReactNode;
  shareOrigin?: OriginTracing | null;
  shouldCloseOnEscapePress?: boolean;
  showFlags: (flags: Array<Flag>) => void;
  triggerButtonAppearance?: ButtonAppearances;
  triggerButtonStyle?: ShareButtonStyle;
};

const InlineDialogFormWrapper = styled.div`
  width: 352px;
  margin: -16px 0;
`;

export const defaultShareContentState: DialogContentState = {
  users: [],
  comment: {
    format: 'plain_text' as 'plain_text',
    value: '',
  },
};

class ShareDialogWithTriggerInternal extends React.Component<
  Props & InjectedIntlProps & WithAnalyticsEventProps,
  State
> {
  static defaultProps = {
    isDisabled: false,
    dialogPlacement: 'bottom-end' as 'bottom-end',
    shouldCloseOnEscapePress: true,
    triggerButtonAppearance: 'subtle' as 'subtle',
    triggerButtonStyle: 'icon-only' as 'icon-only',
  };
  private containerRef = React.createRef<HTMLDivElement>();
  private start: number = 0;

  escapeIsHeldDown: boolean = false;

  state: State = {
    isDialogOpen: false,
    isSharing: false,
    ignoreIntermediateState: false,
    defaultValue: defaultShareContentState,
  };

  private closeAndResetDialog = () => {
    this.setState({
      defaultValue: defaultShareContentState,
      ignoreIntermediateState: true,
      shareError: undefined,
      isDialogOpen: false,
    });
  };

  private createAndFireEvent = (payload: AnalyticsEventPayload) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      createAnalyticsEvent(payload).fire('fabric-elements');
    }
  };

  private getFlags = (
    config: ConfigResponse | undefined,
    data: DialogContentState,
  ) => {
    const { formatMessage } = this.props.intl;
    const flags: Array<Flag> = [];
    const shouldShowAdminNotifiedFlag = showInviteWarning(config, data.users);

    if (shouldShowAdminNotifiedFlag) {
      flags.push({
        appearance: 'success',
        title: {
          ...messages.adminNotifiedMessage,
          defaultMessage: formatMessage(messages.adminNotifiedMessage),
        },
        type: ADMIN_NOTIFIED,
      });
    }

    flags.push({
      appearance: 'success',
      title: {
        ...messages.shareSuccessMessage,
        defaultMessage: formatMessage(messages.shareSuccessMessage, {
          object: this.props.shareContentType.toLowerCase(),
        }),
      },
      type: OBJECT_SHARED,
    });

    // The reason for providing message property is that in jira,
    // the Flag system takes only Message Descriptor as payload
    // and formatMessage is called for every flag
    // if the translation data is not provided, a translated default message
    // will be displayed
    return flags;
  };

  private handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { isDialogOpen } = this.state;
    const { shouldCloseOnEscapePress } = this.props;
    if (isDialogOpen && shouldCloseOnEscapePress) {
      switch (event.key) {
        case 'Escape':
          // react-select will always capture the event via onKeyDown
          // and trigger event.preventDefault()
          if (event.defaultPrevented) {
            // put the focus back onto the share dialog so that
            // the user can press the escape key again to close the dialog
            if (this.containerRef.current) {
              this.containerRef.current.focus();
            }
            return;
          }
          event.stopPropagation();
          this.closeAndResetDialog();
          this.createAndFireEvent(cancelShare(this.start));
      }
    }
  };

  private onTriggerClick = () => {
    this.createAndFireEvent(buttonClicked());

    this.setState(
      {
        isDialogOpen: !this.state.isDialogOpen,
        ignoreIntermediateState: false,
      },
      () => {
        const { isDialogOpen } = this.state;
        if (isDialogOpen) {
          this.start = Date.now();
          this.createAndFireEvent(screenEvent());

          if (this.containerRef.current) {
            this.containerRef.current.focus();
          }

          // always refetch the config when modal is re-opened
          this.props.fetchConfig();
        }
      },
    );
  };

  private handleCloseDialog = (_: { isOpen: boolean; event: any }) => {
    this.setState({ isDialogOpen: false });
  };

  private handleShareSubmit = (data: DialogContentState) => {
    const { onShareSubmit, shareOrigin, showFlags, config } = this.props;
    if (!onShareSubmit) {
      return;
    }

    this.setState({ isSharing: true });

    this.createAndFireEvent(submitShare(this.start, data, shareOrigin, config));

    onShareSubmit(data)
      .then(() => {
        this.closeAndResetDialog();
        this.setState({ isSharing: false });
        showFlags(this.getFlags(config, data));
      })
      .catch((err: Error) => {
        this.setState({
          isSharing: false,
          shareError: {
            message: err.message,
          },
        });
      });
  };

  private handleFormDismiss = (data: DialogContentState) => {
    this.setState(({ ignoreIntermediateState }) =>
      ignoreIntermediateState ? null : { defaultValue: data },
    );
  };

  handleCopyLink = () => {
    this.createAndFireEvent(copyShareLink(this.start, this.props.shareOrigin));
  };

  render() {
    const { isDialogOpen, isSharing, shareError, defaultValue } = this.state;
    const {
      intl: { formatMessage },
      copyLink,
      dialogPlacement,
      isDisabled,
      isFetchingConfig,
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
            <AnalyticsContext data={{ source: 'shareModal' }}>
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
                  onLinkCopy={this.handleCopyLink}
                  isFetchingConfig={isFetchingConfig}
                />
              </InlineDialogFormWrapper>
            </AnalyticsContext>
          }
          isOpen={isDialogOpen}
          onClose={this.handleCloseDialog}
          placement={dialogPlacement}
        >
          {this.props.renderCustomTriggerButton ? (
            this.props.renderCustomTriggerButton({
              error: shareError,
              isSelected: isDialogOpen,
              onClick: this.onTriggerClick,
            })
          ) : (
            <ShareButton
              appearance={triggerButtonAppearance}
              text={
                triggerButtonStyle !== 'icon-only' ? (
                  <FormattedMessage {...messages.shareTriggerButtonText} />
                ) : null
              }
              onClick={this.onTriggerClick}
              iconBefore={
                triggerButtonStyle !== 'text-only' ? (
                  <ShareIcon
                    label={formatMessage(messages.shareTriggerButtonIconLabel)}
                  />
                ) : (
                  undefined
                )
              }
              isSelected={isDialogOpen}
              isDisabled={isDisabled}
            />
          )}
        </InlineDialog>
      </div>
    );
  }
}

export const ShareDialogWithTrigger: React.ComponentType<
  Props
> = withAnalyticsEvents()(injectIntl(ShareDialogWithTriggerInternal));
