import { ButtonAppearances } from '@atlaskit/button';
import { LoadOptions } from '@atlaskit/user-picker';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import {
  ConfigResponse,
  ShareClient,
  ShareServiceClient,
} from '../clients/ShareServiceClient';
import {
  Content,
  DialogContentState,
  DialogPlacement,
  Flag,
  MetaData,
  OriginTracing,
  OriginTracingFactory,
  RenderCustomTriggerButton,
  ShareButtonStyle,
  ShareResponse,
} from '../types';
import MessagesIntlProvider from './MessagesIntlProvider';
import { ShareDialogWithTrigger } from './ShareDialogWithTrigger';
import { optionDataToUsers } from './utils';

export type Props = {
  /** Share service client implementation that gets share configs and performs share */
  client?: ShareClient;
  /** Cloud ID of the instance */
  cloudId: string;
  /** Placement of the modal to the trigger button */
  dialogPlacement?: DialogPlacement;
  /** Transform function to provide custom formatted copy link, a default memorized function is provided */
  formatCopyLink: (origin: OriginTracing, link: string) => string;
  /** Function used to load users options asynchronously */
  loadUserOptions: LoadOptions;
  /** Factory function to generate new Origin Tracing instance */
  originTracingFactory: OriginTracingFactory;
  /** Product ID of the share
   * confluence
   * jira-core
   * jira-servicedesk
   * jira-software
   */
  productId: string;
  /** Render function for a custom Share Dialog Trigger Button*/
  renderCustomTriggerButton?: RenderCustomTriggerButton;
  /** Atlassian Resource Identifier of a Site resource to be shared */
  shareAri: string;
  /** Content Type of the resource to be shared
   * board
   * calendar
   * draft
   * filter
   * issue
   * media
   * page
   * project
   * pullrequest
   * question
   * report
   * repository
   * request
   * roadmap
   * site
   * space
   */
  shareContentType: string;
  /** Link of the resource to be shared */
  shareLink: string;
  /** Title of the resource to be shared that will be sent in notifications */
  shareTitle: string;
  /** Title of the share modal */
  shareFormTitle?: React.ReactNode;
  /** To enable closing the modal on escape key press */
  shouldCloseOnEscapePress?: boolean;
  /**
   * Callback function for showing successful share flag(s) with a parameter providing details of the flag, including the type of the message with a localized default title
   * This package has an opinion on showing flag(s) upon successful share, and Flag system is NOT provided. Instead, showFlag prop is available for this purpose.
   */
  showFlags: (flags: Array<Flag>) => void;
  /** Appearance of the share modal trigger button  */
  triggerButtonAppearance?: ButtonAppearances;
  /** Style of the share modal trigger button */
  triggerButtonStyle?: ShareButtonStyle;
};

export type State = {
  config?: ConfigResponse;
  copyLinkOrigin: OriginTracing | null;
  prevShareLink: string | null;
  shareActionCount: number;
  shareOrigin: OriginTracing | null;
};

const memoizedFormatCopyLink: (
  origin: OriginTracing,
  link: string,
) => string = memoizeOne(
  (origin: OriginTracing, link: string): string => origin.addToUrl(link),
);

// This is a work around for an issue in extract-react-types
// https://github.com/atlassian/extract-react-types/issues/59
const getDefaultShareLink: () => string = () =>
  window ? window.location!.href : '';

export const defaultConfig = {
  mode: 'EXISTING_USERS_ONLY',
  allowComment: false,
};

/**
 * This component serves as a Provider to provide customizable implementations
 * to ShareDialogTrigger component
 */
export class ShareDialogContainer extends React.Component<Props, State> {
  private client: ShareClient;
  private _isMounted = false;

  static defaultProps = {
    shareLink: getDefaultShareLink(),
    formatCopyLink: memoizedFormatCopyLink,
  };

  constructor(props: Props) {
    super(props);

    if (props.client) {
      this.client = props.client;
    } else {
      this.client = new ShareServiceClient();
    }

    this.state = {
      copyLinkOrigin: null,
      prevShareLink: null,
      shareActionCount: 0,
      shareOrigin: null,
      config: {
        ...defaultConfig,
      },
    };
  }

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State,
  ): Partial<State> | null {
    // Whenever there is change in share link, new origins should be created
    // ***
    // memorization is recommended on React doc, but here the Origin Tracing does not reply on shareLink
    // in getDerivedStateFormProps it makes shareLink as determinant of renewal to stand out better
    // ***
    if (
      prevState.prevShareLink ||
      prevState.prevShareLink !== nextProps.shareLink
    ) {
      return {
        copyLinkOrigin: nextProps.originTracingFactory(),
        prevShareLink: nextProps.shareLink,
        shareOrigin: nextProps.originTracingFactory(),
      };
    }

    return null;
  }

  componentDidMount() {
    this._isMounted = true;

    this.fetchConfig();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchConfig = () => {
    this.client
      .getConfig(this.props.productId, this.props.cloudId)
      .then((config: ConfigResponse) => {
        if (this._isMounted) {
          // TODO: Send analytics event
          this.setState({ config });
        }
      })
      .catch(() => {
        // TODO: Send analytics event
        this.setState({ config: defaultConfig });
      });
  };

  handleSubmitShare = ({
    users,
    comment,
  }: DialogContentState): Promise<ShareResponse> => {
    const {
      originTracingFactory,
      productId,
      shareAri,
      shareContentType,
      shareLink,
      shareTitle,
    } = this.props;
    const content: Content = {
      ari: shareAri,
      // original share link is used here
      link: shareLink,
      title: shareTitle,
      type: shareContentType,
    };
    const metaData: MetaData = {
      productId,
      atlOriginId: this.state.shareOrigin!.id,
    };

    return this.client
      .share(content, optionDataToUsers(users), metaData, comment)
      .then((response: ShareResponse) => {
        const newShareCount = this.state.shareActionCount + 1;
        // renew Origin Tracing Id per share action succeeded
        this.setState({
          shareActionCount: newShareCount,
          shareOrigin: originTracingFactory(),
        });

        return response;
      })
      .catch((err: Error) => Promise.reject(err));
  };

  render() {
    const {
      dialogPlacement,
      formatCopyLink,
      loadUserOptions,
      renderCustomTriggerButton,
      shareContentType,
      shareFormTitle,
      shareLink,
      shouldCloseOnEscapePress,
      showFlags,
      triggerButtonAppearance,
      triggerButtonStyle,
    } = this.props;
    const { shareOrigin } = this.state;
    const copyLink = formatCopyLink(this.state.copyLinkOrigin!, shareLink);
    return (
      <MessagesIntlProvider>
        <ShareDialogWithTrigger
          config={this.state.config}
          copyLink={copyLink}
          dialogPlacement={dialogPlacement}
          loadUserOptions={loadUserOptions}
          onShareSubmit={this.handleSubmitShare}
          renderCustomTriggerButton={renderCustomTriggerButton}
          shareContentType={shareContentType}
          shareFormTitle={shareFormTitle}
          shareOrigin={shareOrigin}
          shouldCloseOnEscapePress={shouldCloseOnEscapePress}
          showFlags={showFlags}
          triggerButtonAppearance={triggerButtonAppearance}
          triggerButtonStyle={triggerButtonStyle}
        />
      </MessagesIntlProvider>
    );
  }
}
