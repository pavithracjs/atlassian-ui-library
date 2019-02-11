import { LoadOptions } from '@atlaskit/user-picker';
import memoizeOne from 'memoize-one';
import * as React from 'react';
import { InvitationsCapabilitiesResource } from '../api/InvitationsCapabilitiesResource';
import { ShareServiceClient } from '../clients/ShareServiceClient';
import {
  Client,
  Content,
  DialogContentState,
  InvitationsCapabilitiesProvider,
  InvitationsCapabilitiesResponse,
  MetaData,
  OriginTracing,
  OriginTracingFactory,
  ShareClient,
  ShareResponse,
} from '../types';
import { ShareDialogWithTrigger } from './ShareDialogWithTrigger';
import { optionData2Users } from './utils';

export type Props = {
  client?: Client;
  cloudId: string;
  formatCopyLink: (origin: OriginTracing, link: string) => string;
  loadUserOptions: LoadOptions;
  originTracingFactory: OriginTracingFactory;
  productId: string;
  shareAri: string;
  shareLink: string;
  shareTitle: string;
  shouldShowCommentField?: boolean;
  shouldCloseOnEscapePress?: boolean;
};

export type State = {
  capabilities: InvitationsCapabilitiesResponse | undefined;
  copyLinkOrigin: OriginTracing | null;
  prevShareLink: string | null;
  shareActionCount: number;
  shareToAtlassianAccountHoldersOrigin: OriginTracing | null;
  shareToNewUsersOrigin: OriginTracing | null;
};

const memoizedFormatCopyLink: (
  origin: OriginTracing,
  link: string,
) => string = memoizeOne(
  (origin: OriginTracing, link: string): string => origin.addToUrl(link),
);

/**
 * This component serves as a Provider to provide customizable implementations
 * to ShareDialogTrigger component
 */
export class ShareDialogContainer extends React.Component<Props, State> {
  private client: Client;

  static defaultProps = {
    shareLink: window && window.location!.href,
    formatCopyLink: memoizedFormatCopyLink,
  };

  constructor(props: Props) {
    super(props);

    if (props.client) {
      this.client = props.client;
    } else {
      const defaultInvitationsCapabilitiesResource: InvitationsCapabilitiesProvider = new InvitationsCapabilitiesResource(
        props.cloudId,
      );
      const defaultShareSericeClient: ShareClient = new ShareServiceClient();
      this.client = {
        getCapabilities: defaultInvitationsCapabilitiesResource.getCapabilities,
        share: defaultShareSericeClient.share,
      };
    }

    this.state = {
      capabilities: undefined,
      copyLinkOrigin: null,
      prevShareLink: null,
      shareActionCount: 0,
      shareToAtlassianAccountHoldersOrigin: null,
      shareToNewUsersOrigin: null,
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
        shareToAtlassianAccountHoldersOrigin: nextProps.originTracingFactory(),
        shareToNewUsersOrigin: nextProps.originTracingFactory(),
      };
    }

    return null;
  }

  componentDidMount() {
    this.fetchCapabilities();
  }

  fetchCapabilities = () => {
    this.client
      .getCapabilities()
      .then((capabilities: InvitationsCapabilitiesResponse) => {
        // TODO: Send analytics event
        this.setState({
          capabilities,
        });
      })
      .catch(err => {
        // TODO: Send analytics event
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
      shareLink,
      shareTitle,
    } = this.props;
    const content: Content = {
      ari: shareAri,
      // original share link is used here
      link: shareLink,
      title: shareTitle,
    };
    const metaData: MetaData = {
      productId,
      tracking: {
        toAtlassianAccountHolders: {
          atlOriginId: this.state.shareToAtlassianAccountHoldersOrigin!.id,
        },
        toNewUsers: {
          atlOriginId: this.state.shareToNewUsersOrigin!.id,
        },
      },
    };

    return this.client
      .share(content, optionData2Users(users), metaData, comment)
      .then((response: ShareResponse) => {
        const newShareCount = this.state.shareActionCount + 1;
        // TODO: send analytic event

        // renew Origin Tracing Ids per share action succeeded
        this.setState({
          shareActionCount: newShareCount,
          shareToAtlassianAccountHoldersOrigin: originTracingFactory(),
          shareToNewUsersOrigin: originTracingFactory(),
        });

        return response;
      })
      .catch((err: Error) => {
        // TODO: send analytic event
        return Promise.reject(err);
      });
  };

  handleCopyLink = () => {
    // @ts-ignore usused for now until analytics are added
    const originAttributes = this.state.copyLinkOrigin!.toAnalyticsAttributes({
      hasGeneratedId: true,
    });

    // TODO: send analytic event
  };

  render() {
    const {
      formatCopyLink,
      loadUserOptions,
      shareLink,
      shouldShowCommentField,
      shouldCloseOnEscapePress,
    } = this.props;
    const copyLink = formatCopyLink(this.state.copyLinkOrigin!, shareLink);
    return (
      <ShareDialogWithTrigger
        capabilities={this.state.capabilities}
        copyLink={copyLink}
        loadUserOptions={loadUserOptions}
        onLinkCopy={this.handleCopyLink}
        onShareSubmit={this.handleSubmitShare}
        shouldShowCommentField={shouldShowCommentField}
        shouldCloseOnEscapePress={shouldCloseOnEscapePress}
      />
    );
  }
}
