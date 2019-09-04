import {
  AnalyticsContext,
  AnalyticsEventPayload,
  WithAnalyticsEventsProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { ButtonAppearances } from '@atlaskit/button';
import ShareIcon from '@atlaskit/icon/glyph/share';
import InlineDialog from '@atlaskit/inline-dialog';
import Aktooltip from '@atlaskit/tooltip';
import { LoadOptions } from '@atlaskit/user-picker';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import styled from 'styled-components';
import { messages } from '../i18n';
import {
  ADMIN_NOTIFIED,
  ConfigResponse,
  DialogContentState,
  DialogPlacement,
  Flag,
  OBJECT_SHARED,
  OriginTracing,
  RenderCustomTriggerButton,
  ShareButtonStyle,
  ShareError,
  TooltipPosition,
} from '../types';
import {
  cancelShare,
  CHANNEL_ID,
  copyLinkButtonClicked,
  formShareSubmitted,
  screenEvent,
  shareTriggerButtonClicked,
  ANALYTICS_SOURCE,
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
  analyticsDecorator?: (
    payload: AnalyticsEventPayload,
  ) => AnalyticsEventPayload;
  dialogPlacement?: DialogPlacement;
  isDisabled?: boolean;
  isFetchingConfig?: boolean;
  loadUserOptions?: LoadOptions;
  onDialogOpen?: () => void;
  onShareSubmit?: (shareContentState: DialogContentState) => Promise<any>;
  renderCustomTriggerButton?: RenderCustomTriggerButton;
  shareContentType: string;
  shareFormTitle?: React.ReactNode;
  copyLinkOrigin?: OriginTracing;
  formShareOrigin?: OriginTracing;
  shouldCloseOnEscapePress?: boolean;
  showFlags: (flags: Array<Flag>) => void;
  triggerButtonAppearance?: ButtonAppearances;
  triggerButtonStyle?: ShareButtonStyle;
  triggerButtonTooltipPosition?: TooltipPosition;
  triggerButtonTooltipText?: React.ReactNode;
  bottomMessage?: React.ReactNode;
  submitButtonLabel?: React.ReactNode;
};

const ShareButtonWrapper = styled.div`
  display: inline-flex;
  outline: none;
`;

const InlineDialogFormWrapper = styled.div`
  width: 352px;
  margin: -16px 0;
`;

const BottomMessageWrapper = styled.div`
  width: 352px;
`;

export const defaultShareContentState: DialogContentState = {
  users: [],
  comment: {
    format: 'plain_text' as 'plain_text',
    value: '',
  },
};

export class ShareDialogWithTriggerInternal extends React.PureComponent<
  Props & InjectedIntlProps & WithAnalyticsEventsProps,
  State
> {
  static defaultProps: Partial<Props> = {
    isDisabled: false,
    dialogPlacement: 'bottom-end',
    shouldCloseOnEscapePress: true,
    triggerButtonAppearance: 'subtle',
    triggerButtonStyle: 'icon-only',
    triggerButtonTooltipPosition: 'top',
  };
  private containerRef = React.createRef<HTMLDivElement>();
  private start: number = 0;

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
    const { createAnalyticsEvent, analyticsDecorator } = this.props;
    if (analyticsDecorator) payload = analyticsDecorator(payload);
    if (createAnalyticsEvent) createAnalyticsEvent(payload).fire(CHANNEL_ID);
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
          const isKeyPressedOnContainer = !!(
            this.containerRef.current &&
            this.containerRef.current === event.target
          );

          // we DO NOT expect any prevent default behavior on the container itself
          // the defaultPrevented check will happen only if the key press occurs on the container's children
          if (!isKeyPressedOnContainer && event.defaultPrevented) {
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
    this.createAndFireEvent(shareTriggerButtonClicked());

    this.setState(
      state => ({
        isDialogOpen: !state.isDialogOpen,
        ignoreIntermediateState: false,
      }),
      () => {
        const { onDialogOpen } = this.props;
        const { isDialogOpen } = this.state;
        if (isDialogOpen) {
          this.start = Date.now();
          this.createAndFireEvent(screenEvent());
          if (onDialogOpen) onDialogOpen();

          if (this.containerRef.current) {
            this.containerRef.current.focus();
          }
        }
      },
    );
  };

  private handleCloseDialog = (_: { isOpen: boolean; event: any }) => {
    this.setState({ isDialogOpen: false });
  };

  private handleShareSubmit = (data: DialogContentState) => {
    const {
      onShareSubmit,
      shareContentType,
      formShareOrigin,
      showFlags,
      config,
    } = this.props;
    if (!onShareSubmit) {
      return;
    }

    this.setState({ isSharing: true });

    this.createAndFireEvent(
      formShareSubmitted(
        this.start,
        data,
        shareContentType,
        formShareOrigin,
        config,
      ),
    );

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
    const { copyLinkOrigin, shareContentType } = this.props;
    this.createAndFireEvent(
      copyLinkButtonClicked(this.start, shareContentType, copyLinkOrigin),
    );
  };

  renderShareTriggerButton = () => {
    const { isDialogOpen } = this.state;
    const {
      intl: { formatMessage },
      isDisabled,
      renderCustomTriggerButton,
      triggerButtonTooltipText,
      triggerButtonTooltipPosition,
      triggerButtonAppearance,
      triggerButtonStyle,
    } = this.props;

    let button: React.ReactNode;

    if (renderCustomTriggerButton) {
      const { shareError } = this.state;
      button = renderCustomTriggerButton({
        error: shareError,
        isSelected: isDialogOpen,
        onClick: this.onTriggerClick,
      });
    } else {
      button = (
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
      );
    }

    if (triggerButtonStyle === 'icon-only') {
      button = (
        <Aktooltip
          content={
            triggerButtonTooltipText ||
            formatMessage(messages.shareTriggerButtonTooltipText)
          }
          position={triggerButtonTooltipPosition}
          hideTooltipOnClick
        >
          {button}
        </Aktooltip>
      );
    }

    return button;
  };

  render() {
    const { isDialogOpen, isSharing, shareError, defaultValue } = this.state;
    const {
      copyLink,
      dialogPlacement,
      isFetchingConfig,
      loadUserOptions,
      shareFormTitle,
      config,
      bottomMessage,
      submitButtonLabel,
    } = this.props;

    // for performance purposes, we may want to have a loadable content i.e. ShareForm
    return (
      <ShareButtonWrapper
        tabIndex={0}
        onKeyDown={this.handleKeyDown}
        style={{ outline: 'none' }}
        innerRef={this.containerRef}
      >
        <InlineDialog
          content={
            <AnalyticsContext data={{ source: ANALYTICS_SOURCE }}>
              <>
                <InlineDialogFormWrapper>
                  <ShareForm
                    copyLink={copyLink}
                    loadOptions={loadUserOptions}
                    isSharing={isSharing}
                    onSubmit={this.handleShareSubmit}
                    title={shareFormTitle}
                    shareError={shareError}
                    onDismiss={this.handleFormDismiss}
                    defaultValue={defaultValue}
                    config={config}
                    onLinkCopy={this.handleCopyLink}
                    isFetchingConfig={isFetchingConfig}
                    submitButtonLabel={submitButtonLabel}
                  />
                </InlineDialogFormWrapper>
                {bottomMessage ? (
                  <BottomMessageWrapper>{bottomMessage}</BottomMessageWrapper>
                ) : null}
              </>
            </AnalyticsContext>
          }
          isOpen={isDialogOpen}
          onClose={this.handleCloseDialog}
          placement={dialogPlacement}
        >
          {this.renderShareTriggerButton()}
        </InlineDialog>
      </ShareButtonWrapper>
    );
  }
}

export const ShareDialogWithTrigger = withAnalyticsEvents()(
  injectIntl(ShareDialogWithTriggerInternal),
);
