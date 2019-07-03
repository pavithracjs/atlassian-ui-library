import assert from 'tiny-invariant';
import {
  WithAnalyticsEventProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
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
  UrlShortenerClient,
  AtlassianUrlShortenerClient,
} from '../clients/AtlassianUrlShortenerClient';
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
  ProductId,
} from '../types';
import MessagesIntlProvider from './MessagesIntlProvider';
import { ShareDialogWithTrigger } from './ShareDialogWithTrigger';
import { optionDataToUsers } from './utils';
import { shortUrlRequested } from './analytics';

export const defaultConfig: ConfigResponse = {
  mode: 'EXISTING_USERS_ONLY',
  allowComment: false,
};

export type Props = {
  /** Share service client implementation that gets share configs and performs share */
  shareClient?: ShareClient;
  /** URL Shortener service client implementation that may shorten links for copy */
  urlShortenerClient?: UrlShortenerClient;
  /** Cloud ID of the instance
   * Note: we assume this props is stable. */
  cloudId: string;
  /** Placement of the modal to the trigger button */
  dialogPlacement?: DialogPlacement;
  /** Transform function to provide custom formatted copy link, a default memorized function is provided */
  formatCopyLink?: (origin: OriginTracing, link: string) => string;
  /** Function used to load users options asynchronously */
  loadUserOptions: LoadOptions;
  /** Factory function to generate new Origin Tracing instance */
  originTracingFactory: OriginTracingFactory;
  /** Product ID (Canonical ID) in ARI of the share request
   * Note: we assume this props is stable. */
  productId: ProductId;
  /** Render function for a custom Share Dialog Trigger Button*/
  renderCustomTriggerButton?: RenderCustomTriggerButton;
  /** Atlassian Resource Identifier of a Site resource to be shared */
  shareAri: string;
  /** Content Type of the resource to be shared. It will also affect on the successful share message in the flag. A pre-defined list as follows:*/
  /** blogpost */
  /** board */
  /** calendar */
  /** draft */
  /** filter */
  /** issue */
  /** media */
  /** page */
  /** project */
  /** pullrequest */
  /** question */
  /** report */
  /** repository */
  /** request */
  /** roadmap */
  /** site */
  /** space */
  /** Any other unlisted type will have a default message of "Link shared"*/
  shareContentType: string;
  /** Link of the resource to be shared (should NOT includes origin tracing) */
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
  /** Message to be appended to the modal */
  bottomMessage?: React.ReactNode;
  /** Whether we should use the Atlassian Url Shortener or not */
  useUrlShortener?: boolean;
};

export type State = {
  config?: ConfigResponse;
  isFetchingConfig: boolean;
  shareActionCount: number;
  shortenedCopyLink: null | string;
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

/**
 * This component serves as a Provider to provide customizable implementations
 * to ShareDialogTrigger component
 */
export class ShareDialogContainerInternal extends React.Component<
  WithAnalyticsEventProps & Props,
  State
> {
  private shareClient: ShareClient;
  private urlShortenerClient: UrlShortenerClient;
  private _isMounted = false;
  private _urlShorteningRequestCounter = 0;

  static defaultProps = {
    shareLink: getDefaultShareLink(),
    useUrlShortener: false,
  };

  constructor(props: Props) {
    super(props);

    // v0.4 -> v0.5 .client -> .shareClient
    assert(
      !(props as any).client,
      'elements/share: Breaking change, please update your props!',
    );
    this.shareClient = props.shareClient || new ShareServiceClient();

    this.urlShortenerClient =
      props.urlShortenerClient || new AtlassianUrlShortenerClient();

    this.state = {
      shareActionCount: 0,
      config: defaultConfig,
      isFetchingConfig: false,
      shortenedCopyLink: null,
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fetchConfig = () => {
    this.setState(
      {
        isFetchingConfig: true,
      },
      () => {
        this.shareClient
          .getConfig(this.props.productId, this.props.cloudId)
          .then((config: ConfigResponse) => {
            if (this._isMounted) {
              // TODO: Send analytics event
              this.setState({
                config,
                isFetchingConfig: false,
              });
            }
          })
          .catch(() => {
            if (this._isMounted) {
              // TODO: Send analytics event
              this.setState({
                config: defaultConfig,
                isFetchingConfig: false,
              });
            }
          });
      },
    );
  };

  handleSubmitShare = ({
    users,
    comment,
  }: DialogContentState): Promise<void> => {
    const shareLink = this.getFormShareLink();
    const { productId, shareAri, shareContentType, shareTitle } = this.props;
    const content: Content = {
      ari: shareAri,
      link: shareLink,
      title: shareTitle,
      type: shareContentType,
    };
    const metaData: MetaData = {
      productId,
      atlOriginId: this.getFormShareOriginTracing().id,
    };

    return this.shareClient
      .share(content, optionDataToUsers(users), metaData, comment)
      .then(() => {
        if (!this._isMounted) return;

        // renew Origin Tracing Id per share action succeeded
        this.setState(state => ({
          shareActionCount: state.shareActionCount + 1,
        }));
      });
  };

  handleDialogOpen = () => {
    this.updateShortCopyLink();

    // always refetch the config when modal is re-opened
    this.fetchConfig();
  };

  // ensure origin is re-generated if the link or the factory changes
  // separate memoization is needed since copy != form
  getUniqueCopyLinkOriginTracing = memoizeOne(
    (
      link: string,
      originTracingFactory: OriginTracingFactory,
    ): OriginTracing => {
      return originTracingFactory();
    },
  );
  // form origin must furthermore be regenerated after each form share
  getUniqueFormShareOriginTracing = memoizeOne(
    (
      link: string,
      originTracingFactory: OriginTracingFactory,
      shareCount: number,
    ): OriginTracing => {
      return originTracingFactory();
    },
  );

  getUpToDateShortenedCopyLink = memoizeOne(
    (
      longLink: string,
      cloudId: string,
      productId: ProductId,
    ): Promise<string | null> => {
      this._urlShorteningRequestCounter++;

      const { createAnalyticsEvent } = this.props;
      if (createAnalyticsEvent)
        createAnalyticsEvent(shortUrlRequested()).fire('fabric-elements');

      return this.urlShortenerClient
        .shorten(longLink, cloudId, productId)
        .then(response => response.shortUrl)
        .catch(() => {
          // TODO analytics
          return null;
        });
    },
  );

  getRawLink(): string {
    const { shareLink } = this.props;
    return shareLink;
  }

  getCopyLinkOriginTracing(): OriginTracing {
    const { originTracingFactory } = this.props;
    const shareLink = this.getRawLink();
    return this.getUniqueCopyLinkOriginTracing(shareLink, originTracingFactory);
  }

  getFormShareOriginTracing(): OriginTracing {
    const { originTracingFactory } = this.props;
    const { shareActionCount } = this.state;
    const shareLink = this.getRawLink();
    return this.getUniqueFormShareOriginTracing(
      shareLink,
      originTracingFactory,
      shareActionCount,
    );
  }

  getFullCopyLink(): string {
    const { formatCopyLink } = this.props;
    const shareLink = this.getRawLink();
    const copyLinkOrigin = this.getCopyLinkOriginTracing();
    return (formatCopyLink || memoizedFormatCopyLink)(
      copyLinkOrigin,
      shareLink,
    );
  }

  isShortCopyLinkAvailable = (): boolean => {
    const { useUrlShortener } = this.props;
    const { shortenedCopyLink } = this.state;

    return !!useUrlShortener && !!shortenedCopyLink;
  };

  getCopyLink = (): string => {
    if (this.isShortCopyLinkAvailable()) return this.state.shortenedCopyLink!;

    return this.getFullCopyLink();
  };

  updateShortCopyLink() {
    this.setState({
      shortenedCopyLink: null,
    });

    const { useUrlShortener } = this.props;
    if (!useUrlShortener) return;

    const longLink = this.getFullCopyLink();
    const { cloudId, productId } = this.props;
    const shortLink = this.getUpToDateShortenedCopyLink(
      longLink,
      cloudId,
      productId,
    );
    const requestCounter = this._urlShorteningRequestCounter;
    shortLink.then(shortenedCopyLink => {
      if (!this._isMounted) return;
      const isRequestOutdated =
        requestCounter !== this._urlShorteningRequestCounter;
      if (isRequestOutdated) return;

      this.setState({ shortenedCopyLink });
    });
  }

  getFormShareLink = (): string => {
    // original share link is used here
    return this.getRawLink();
  };

  render() {
    const {
      dialogPlacement,
      loadUserOptions,
      renderCustomTriggerButton,
      shareContentType,
      shareFormTitle,
      shouldCloseOnEscapePress,
      showFlags,
      triggerButtonAppearance,
      triggerButtonStyle,
      bottomMessage,
    } = this.props;
    const { isFetchingConfig } = this.state;
    return (
      <MessagesIntlProvider>
        <ShareDialogWithTrigger
          config={this.state.config}
          copyLink={this.getCopyLink()}
          isCopyLinkShortened={this.isShortCopyLinkAvailable()}
          dialogPlacement={dialogPlacement}
          isFetchingConfig={isFetchingConfig}
          loadUserOptions={loadUserOptions}
          onDialogOpen={this.handleDialogOpen}
          onShareSubmit={this.handleSubmitShare}
          renderCustomTriggerButton={renderCustomTriggerButton}
          shareContentType={shareContentType}
          shareFormTitle={shareFormTitle}
          copyLinkOrigin={this.getCopyLinkOriginTracing()}
          formShareOrigin={this.getFormShareOriginTracing()}
          shouldCloseOnEscapePress={shouldCloseOnEscapePress}
          showFlags={showFlags}
          triggerButtonAppearance={triggerButtonAppearance}
          triggerButtonStyle={triggerButtonStyle}
          bottomMessage={bottomMessage}
        />
      </MessagesIntlProvider>
    );
  }
}

export const ShareDialogContainer: React.ComponentType<
  Props
> = withAnalyticsEvents()(ShareDialogContainerInternal);
