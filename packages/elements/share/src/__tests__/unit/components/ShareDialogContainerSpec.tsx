import { OptionData } from '@atlaskit/user-picker';
import { utils } from '@atlaskit/util-service-support';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as ShareServiceExports from '../../../clients/ShareServiceClient';
import { UrlShortenerClient } from '../../../clients/AtlassianUrlShortenerClient';
import {
  Props,
  ShareDialogContainer,
  State,
  defaultConfig,
} from '../../../components/ShareDialogContainer';
import { ShareDialogWithTrigger } from '../../../components/ShareDialogWithTrigger';
import { OriginTracing, TooltipPosition } from '../../../types';

function currentEventLoopEnd() {
  return new Promise(resolve => setImmediate(resolve));
}

describe('ShareDialogContainer', () => {
  let mockOriginTracing: OriginTracing;
  let mockOriginTracingFactory: jest.Mock;
  let mockRequestService: jest.Mock;
  let mockShareServiceClient: jest.Mock;
  const mockCloudId = 'cloudId';
  const mockDialogPlacement = 'bottom-start';
  const mockProductId = 'confluence';
  const mockShareAri = 'ari';
  const mockShareContentType = 'issue';
  const mockShareLink = 'https://share-link';
  const mockShareTitle = 'Share Title';
  const mockTriggerButtonStyle = 'icon-with-text' as 'icon-with-text';
  const mockTriggerButtonAppearance = 'subtle';
  const mockFormatCopyLink = jest.fn((origin, link) => link + '&someOrigin');
  const mockShouldCloseOnEscapePress = true;
  const mockUsers: OptionData[] = [
    { type: 'user', id: 'id', name: 'User 1' },
    { type: 'email', id: 'mock@email.com', name: 'mock@email.com' },
  ];
  const mockComment = {
    format: 'plain_text' as 'plain_text',
    value: 'comment',
  };
  const mockLoadUserOptions = () => [];
  const mockConfig: ShareServiceExports.ConfigResponse = {
    mode: 'EXISTING_USERS_ONLY',
    allowComment: true,
  };
  const mockGetConfig = jest.fn().mockResolvedValue(mockConfig);
  const mockShare = jest.fn().mockResolvedValue({});
  const mockShareClient: ShareServiceExports.ShareClient = {
    getConfig: mockGetConfig,
    share: mockShare,
  };
  const SHORTENED_URL = 'https://short';
  const mockShortenerClient: UrlShortenerClient = {
    isSupportedProduct: jest.fn().mockReturnValue(true),
    shorten: jest.fn().mockResolvedValue({ shortLink: SHORTENED_URL }),
  };
  const mockShowFlags = jest.fn();
  const mockRenderCustomTriggerButton = jest.fn();
  const mockTriggerButtonTooltipText = 'Share Tooltip';
  const mockTriggerButtonTooltipPosition: TooltipPosition = 'mouse';

  beforeEach(() => {
    mockOriginTracing = {
      id: 'id',
      addToUrl: jest.fn(),
      toAnalyticsAttributes: jest.fn(),
    };
    mockOriginTracingFactory = jest.fn().mockReturnValue(mockOriginTracing);
    mockRequestService = jest
      .spyOn(utils, 'requestService')
      .mockResolvedValue(mockConfig);
    mockShareServiceClient = jest
      .spyOn(ShareServiceExports, 'ShareServiceClient')
      .mockImplementation(() => ({
        share: mockShare,
        getConfig: mockGetConfig,
      }));
  });

  afterEach(() => {
    mockRequestService.mockRestore();
    mockShareServiceClient.mockRestore();
    (mockShortenerClient.isSupportedProduct as jest.Mock).mockClear();
    (mockShortenerClient.shorten as jest.Mock).mockClear();
  });

  function getWrapper(
    overrides: Partial<Props> = {},
  ): ShallowWrapper<Props, State, ShareDialogContainer> {
    let props: Props = {
      shareClient: mockShareClient,
      urlShortenerClient: mockShortenerClient,
      cloudId: mockCloudId,
      dialogPlacement: mockDialogPlacement,
      loadUserOptions: mockLoadUserOptions,
      originTracingFactory: mockOriginTracingFactory,
      productId: mockProductId,
      renderCustomTriggerButton: mockRenderCustomTriggerButton,
      shareAri: mockShareAri,
      shareContentType: mockShareContentType,
      shareLink: mockShareLink,
      shareTitle: mockShareTitle,
      showFlags: mockShowFlags,
      formatCopyLink: mockFormatCopyLink,
      shouldCloseOnEscapePress: mockShouldCloseOnEscapePress,
      triggerButtonAppearance: mockTriggerButtonAppearance,
      triggerButtonStyle: mockTriggerButtonStyle,
      triggerButtonTooltipText: mockTriggerButtonTooltipText,
      triggerButtonTooltipPosition: mockTriggerButtonTooltipPosition,
      ...overrides,
    };

    return shallow(<ShareDialogContainer {...props} />);
  }

  it('should render', () => {
    const wrapper = getWrapper();
    const shareDialogWithTrigger = wrapper.find(ShareDialogWithTrigger);
    expect(shareDialogWithTrigger).toHaveLength(1);
    expect(mockFormatCopyLink).toHaveBeenCalled();
    expect(shareDialogWithTrigger.prop('triggerButtonAppearance')).toEqual(
      mockTriggerButtonAppearance,
    );
    expect(shareDialogWithTrigger.prop('triggerButtonStyle')).toEqual(
      mockTriggerButtonStyle,
    );
    expect(shareDialogWithTrigger.prop('copyLink')).toEqual(
      mockFormatCopyLink(null, mockShareLink),
    );
    expect(shareDialogWithTrigger.prop('triggerButtonTooltipText')).toEqual(
      mockTriggerButtonTooltipText,
    );
    expect(shareDialogWithTrigger.prop('triggerButtonTooltipPosition')).toEqual(
      mockTriggerButtonTooltipPosition,
    );
    expect(shareDialogWithTrigger.prop('dialogPlacement')).toEqual(
      mockDialogPlacement,
    );
    expect(shareDialogWithTrigger.prop('loadUserOptions')).toEqual(
      mockLoadUserOptions,
    );
    expect(shareDialogWithTrigger.prop('renderCustomTriggerButton')).toEqual(
      mockRenderCustomTriggerButton,
    );
    expect(shareDialogWithTrigger.prop('shouldCloseOnEscapePress')).toEqual(
      mockShouldCloseOnEscapePress,
    );
    expect(shareDialogWithTrigger.prop('config')).toEqual(
      wrapper.state().config,
    );
    expect(mockOriginTracingFactory).toHaveBeenCalledTimes(2);
    expect(mockShareClient.getConfig).toHaveBeenCalledTimes(0);
    expect(wrapper.state().config).toEqual(defaultConfig);
  });

  it('should call props.originTracingFactory only once when nothing change', () => {
    const wrapper = getWrapper();
    mockOriginTracingFactory.mockReset();

    const previousCopyOrigin = wrapper.instance().getCopyLinkOriginTracing();
    const previousFormShareOrigin = wrapper
      .instance()
      .getFormShareOriginTracing();

    expect(mockOriginTracingFactory).toHaveBeenCalledTimes(0); // because was memoized

    expect(wrapper.instance().getCopyLinkOriginTracing()).toBe(
      previousCopyOrigin,
    );
    expect(wrapper.instance().getFormShareOriginTracing()).toBe(
      previousFormShareOrigin,
    );

    expect(mockOriginTracingFactory).toHaveBeenCalledTimes(0); // still memoized
  });

  it('should call props.originTracingFactory again if shareLink prop is updated', () => {
    const wrapper = getWrapper();
    mockOriginTracingFactory.mockReset();

    const previousCopyOrigin = wrapper.instance().getCopyLinkOriginTracing();
    const previousFormShareOrigin = wrapper
      .instance()
      .getFormShareOriginTracing();

    wrapper.setProps({ shareLink: 'new-share-link' });

    expect(mockOriginTracingFactory).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().getCopyLinkOriginTracing()).not.toBe(
      previousCopyOrigin,
    );
    expect(wrapper.instance().getFormShareOriginTracing()).not.toBe(
      previousFormShareOrigin,
    );
  });

  it('should have default this.client if props.client is not given', () => {
    const wrapper = getWrapper({
      shareClient: undefined,
    });

    const shareClient: ShareServiceExports.ShareClient =
      // @ts-ignore: accessing private variable for testing purpose
      wrapper.instance().shareClient;
    expect(shareClient.getConfig).toEqual(mockGetConfig);
    expect(shareClient.share).toEqual(mockShare);
  });

  describe('config fetch', () => {
    it('should call fetchConfig everytime the dialog open', () => {
      const wrapper = getWrapper();

      const fetchConfig = (wrapper.instance().fetchConfig = jest.fn(
        wrapper.instance().fetchConfig,
      ));

      expect(fetchConfig).not.toHaveBeenCalled();

      wrapper.instance().handleDialogOpen();

      expect(fetchConfig).toHaveBeenCalledTimes(1);
    });
  });

  describe('isFetchingConfig state', () => {
    it('should be false by default', () => {
      const wrapper = getWrapper();
      expect((wrapper.state() as State).isFetchingConfig).toBe(false);
    });

    it('should be passed into isFetchingConfig prop in ShareDialogWithTrigger', () => {
      const wrapper = getWrapper();
      let { isFetchingConfig }: Partial<State> = wrapper.state();
      expect(isFetchingConfig).toEqual(false);
      expect(
        wrapper.find(ShareDialogWithTrigger).prop('isFetchingConfig'),
      ).toEqual(isFetchingConfig);

      (wrapper as any).setState({ isFetchingConfig: !isFetchingConfig });

      expect(
        wrapper.find(ShareDialogWithTrigger).prop('isFetchingConfig'),
      ).toEqual(!isFetchingConfig);
    });

    it('should be set to true when fetchConfig is called, and set back to false when the network request is finished', async () => {
      const wrapper = getWrapper();
      wrapper.instance().fetchConfig();
      expect(wrapper.state().isFetchingConfig).toBe(true);
      await currentEventLoopEnd();
      expect(wrapper.state().isFetchingConfig).toBe(false);
    });
  });

  it('should reset the state.config to default config if shareClient.getConfig failed', async () => {
    const wrapper = getWrapper();
    mockGetConfig.mockRejectedValueOnce(new Error('error'));
    wrapper.setState({ config: mockConfig });
    wrapper.instance().fetchConfig();
    expect(wrapper.state().isFetchingConfig).toBe(true);
    await currentEventLoopEnd();
    expect(wrapper.state().config).toMatchObject(defaultConfig);
    expect(wrapper.state().isFetchingConfig).toBe(false);
  });

  describe('handleSubmitShare', () => {
    it('should call share function from this.client', () => {
      const wrapper = getWrapper();
      const mockDialogContentState = {
        users: mockUsers,
        comment: mockComment,
      };
      wrapper.instance().handleSubmitShare(mockDialogContentState);
      wrapper.instance().forceUpdate();
      expect(mockShare).toHaveBeenCalledTimes(1);
      expect(mockShare).toHaveBeenCalledWith(
        {
          ari: mockShareAri,
          link: mockShareLink,
          title: mockShareTitle,
          type: mockShareContentType,
        },
        [{ type: 'user', id: 'id' }, { type: 'user', email: 'mock@email.com' }],
        {
          productId: mockProductId,
          atlOriginId: wrapper.instance().getFormShareOriginTracing().id,
        },
        mockComment,
      );
    });

    it('should update shareActionCount from the state if share is successful', async () => {
      const wrapper = getWrapper();
      const mockShareResponse = {};
      mockShare.mockResolvedValueOnce(mockShareResponse);
      const mockDialogContentState = {
        users: mockUsers,
        comment: mockComment,
      };
      const result = await wrapper
        .instance()
        .handleSubmitShare(mockDialogContentState);
      expect(result).toEqual(mockShareResponse);
    });

    it('should update the mail Origin Ids if share is successful', async () => {
      const wrapper = getWrapper();
      mockOriginTracingFactory.mockReset();

      const previousCopyOrigin = wrapper.instance().getCopyLinkOriginTracing();
      const previousFormShareOrigin = wrapper
        .instance()
        .getFormShareOriginTracing();

      expect(mockOriginTracingFactory).toHaveBeenCalledTimes(0); // because was memoized

      const mockDialogContentState = {
        users: mockUsers,
        comment: mockComment,
      };
      await wrapper.instance().handleSubmitShare(mockDialogContentState);

      expect(wrapper.instance().getCopyLinkOriginTracing()).toBe(
        previousCopyOrigin,
      ); // no change
      expect(wrapper.instance().getFormShareOriginTracing()).not.toBe(
        previousFormShareOrigin,
      ); // change
      expect(mockOriginTracingFactory).toHaveBeenCalledTimes(1); // only once for mail
    });

    it('should return a Promise Rejection if share is failed', async () => {
      const wrapper = getWrapper();
      mockShare.mockRejectedValueOnce('error');
      wrapper.instance().forceUpdate();
      const mockDialogContentState = {
        users: mockUsers,
        comment: mockComment,
      };
      try {
        await wrapper
          .instance()
          .handleSubmitShare(mockDialogContentState as any);
      } catch (err) {
        expect(err).toEqual('error');
      }
    });
  });

  describe('url shortening', () => {
    it('should provides a default shortening client if none given', () => {
      const wrapper = getWrapper({
        urlShortenerClient: undefined,
      });

      const urlShortenerClient =
        // @ts-ignore: accessing private variable for testing purpose
        wrapper.instance().urlShortenerClient;
      expect(urlShortenerClient.shorten).toBeTruthy();
      expect(urlShortenerClient.shorten).not.toEqual(
        mockShortenerClient.shorten,
      );
      expect(urlShortenerClient.isSupportedProduct).toBeTruthy();
      expect(urlShortenerClient.isSupportedProduct).not.toEqual(
        mockShortenerClient.isSupportedProduct,
      );
    });

    it('should use the given shortening client if passed as prop', () => {
      const wrapper = getWrapper();

      const urlShortenerClient =
        // @ts-ignore: accessing private variable for testing purpose
        wrapper.instance().urlShortenerClient;
      expect(urlShortenerClient.shorten).toEqual(mockShortenerClient.shorten);
      expect(urlShortenerClient.isSupportedProduct).toEqual(
        mockShortenerClient.isSupportedProduct,
      );
    });

    it('should NOT shorten the url if not enabled', async () => {
      const wrapper = getWrapper();

      expect(mockShortenerClient.shorten).not.toHaveBeenCalled();
      wrapper.instance().getUpToDateShortenedCopyLink = jest
        .fn()
        .mockRejectedValue(new Error('TEST!'));

      // stimulate in various ways
      wrapper.instance().getCopyLink();
      wrapper.instance().handleDialogOpen();
      wrapper.instance().getCopyLink();
      await currentEventLoopEnd();

      expect(mockShortenerClient.shorten).not.toHaveBeenCalled();
      expect(
        wrapper.instance().getUpToDateShortenedCopyLink,
      ).not.toHaveBeenCalled();
      expect(wrapper.instance().getCopyLink()).toEqual(
        wrapper.instance().getFullCopyLink(),
      );
    });

    it('should not shorten if the product is not supported', async () => {
      const wrapper = getWrapper({
        useUrlShortener: true,
        urlShortenerClient: undefined, // use the internal one
        productId: 'trello',
      });

      wrapper.instance().handleDialogOpen();
      await currentEventLoopEnd();

      expect(wrapper.instance().getCopyLink()).toEqual(
        wrapper.instance().getFullCopyLink(),
      );
    });

    it('should shorten the url only once the popup opens', async () => {
      const wrapper = getWrapper({
        useUrlShortener: true,
      });
      const updateShortCopyLink = (wrapper.instance().updateShortCopyLink = jest.fn(
        wrapper.instance().updateShortCopyLink,
      ));
      const getUpToDateShortenedCopyLink = (wrapper.instance().getUpToDateShortenedCopyLink = jest.fn(
        wrapper.instance().getUpToDateShortenedCopyLink,
      ));

      expect(mockShortenerClient.shorten).not.toHaveBeenCalled();
      expect(wrapper.state().shortenedCopyLink).toBeNull();
      expect(wrapper.instance().getCopyLink()).toEqual(
        wrapper.instance().getFullCopyLink(),
      );

      wrapper.instance().handleDialogOpen();

      expect(updateShortCopyLink).toHaveBeenCalledTimes(1);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(1);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1);

      await currentEventLoopEnd();

      expect(wrapper.state().shortenedCopyLink).toEqual(SHORTENED_URL);
      expect(wrapper.instance().getCopyLink()).toEqual(SHORTENED_URL);
    });

    it('should re-shorten the url on change and only on change', async () => {
      const mockShortenerClient: UrlShortenerClient = {
        isSupportedProduct: jest.fn().mockReturnValue(true),
        shorten: jest.fn().mockResolvedValue({ shortLink: SHORTENED_URL }),
      };
      const wrapper = getWrapper({
        useUrlShortener: true,
        urlShortenerClient: mockShortenerClient,
      });
      const updateShortCopyLink = (wrapper.instance().updateShortCopyLink = jest.fn(
        wrapper.instance().updateShortCopyLink,
      ));
      const getUpToDateShortenedCopyLink = (wrapper.instance().getUpToDateShortenedCopyLink = jest.fn(
        wrapper.instance().getUpToDateShortenedCopyLink,
      ));

      expect(mockShortenerClient.shorten).not.toHaveBeenCalled();
      expect(wrapper.state().shortenedCopyLink).toBeNull();
      expect(wrapper.instance().getCopyLink()).toEqual(
        wrapper.instance().getFullCopyLink(),
      );

      wrapper.instance().handleDialogOpen();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(1);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(1);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1);

      // no change

      wrapper.instance().handleDialogOpen();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(2);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(2);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(1); // thanks to memo

      // change
      const NEW_SHORTENED_URL = 'https://short2';
      (mockShortenerClient.shorten as jest.Mock).mockResolvedValue({
        shortLink: NEW_SHORTENED_URL,
      });
      wrapper.setProps({ shareLink: 'new-share-link' });

      wrapper.instance().handleDialogOpen();
      expect(updateShortCopyLink).toHaveBeenCalledTimes(3);
      expect(getUpToDateShortenedCopyLink).toHaveBeenCalledTimes(3);
      expect(mockShortenerClient.shorten).toHaveBeenCalledTimes(2);
      expect(wrapper.state().shortenedCopyLink).toEqual(null); // invalidated

      await currentEventLoopEnd();
      expect(wrapper.state().shortenedCopyLink).toEqual(NEW_SHORTENED_URL);
      expect(wrapper.instance().getCopyLink()).toEqual(NEW_SHORTENED_URL);
    });
  });
});
