import { OptionData } from '@atlaskit/user-picker';
import { utils } from '@atlaskit/util-service-support';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import * as ShareServiceExports from '../../../clients/ShareServiceClient';
import {
  Props,
  ShareDialogContainer,
  State,
  defaultConfig,
} from '../../../components/ShareDialogContainer';
import { ShareDialogWithTrigger } from '../../../components/ShareDialogWithTrigger';
import { OriginTracing } from '../../../types';

let wrapper: ShallowWrapper<Props, State, ShareDialogContainer>;
let mockOriginTracing: OriginTracing;
let mockOriginTracingFactory: jest.Mock;
let mockRequestService: jest.Mock;
let mockShareServiceClient: jest.Mock;
const mockCloudId = 'cloudId';
const mockDialogPlacement = 'bottom-start';
const mockProductId = 'productId';
const mockShareAri = 'ari';
const mockShareContentType = 'issue';
const mockShareLink = 'share-link';
const mockShareTitle = 'Share Title';
const mockTriggerButtonStyle = 'icon-with-text' as 'icon-with-text';
const mockTriggerButtonAppearance = 'subtle';
const mockCopyLink = 'copy-link';
const mockFormatCopyLink = jest.fn().mockReturnValue(mockCopyLink);
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
const mockClient: ShareServiceExports.ShareClient = {
  getConfig: mockGetConfig,
  share: mockShare,
};
const mockShowFlags = jest.fn();
const mockRenderCustomTriggerButton = jest.fn();

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
  wrapper = shallow(
    <ShareDialogContainer
      client={mockClient}
      cloudId={mockCloudId}
      dialogPlacement={mockDialogPlacement}
      loadUserOptions={mockLoadUserOptions}
      originTracingFactory={mockOriginTracingFactory}
      productId={mockProductId}
      renderCustomTriggerButton={mockRenderCustomTriggerButton}
      shareAri={mockShareAri}
      shareContentType={mockShareContentType}
      shareLink={mockShareLink}
      shareTitle={mockShareTitle}
      showFlags={mockShowFlags}
      formatCopyLink={mockFormatCopyLink}
      shouldCloseOnEscapePress={mockShouldCloseOnEscapePress}
      triggerButtonAppearance={mockTriggerButtonAppearance}
      triggerButtonStyle={mockTriggerButtonStyle}
    />,
  );
});

afterEach(() => {
  mockRequestService.mockRestore();
  mockShareServiceClient.mockRestore();
});

describe('ShareDialogContainer', () => {
  it('should render', () => {
    const shareDialogWithTrigger = wrapper.find(ShareDialogWithTrigger);
    expect(shareDialogWithTrigger).toHaveLength(1);
    expect(mockFormatCopyLink).toHaveBeenCalled();
    expect(shareDialogWithTrigger.prop('triggerButtonAppearance')).toEqual(
      mockTriggerButtonAppearance,
    );
    expect(shareDialogWithTrigger.prop('triggerButtonStyle')).toEqual(
      mockTriggerButtonStyle,
    );
    expect(shareDialogWithTrigger.prop('copyLink')).toEqual(mockCopyLink);
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
    expect(mockClient.getConfig).toHaveBeenCalledTimes(0);
    expect(wrapper.state().config).toEqual(defaultConfig);
  });

  it('should call props.originTracingFactory only once when nothing change', () => {
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
    const newWrapper: ShallowWrapper<
      Props,
      State,
      ShareDialogContainer
    > = shallow<ShareDialogContainer>(
      <ShareDialogContainer
        cloudId={mockCloudId}
        loadUserOptions={mockLoadUserOptions}
        originTracingFactory={mockOriginTracingFactory}
        productId={mockProductId}
        shareAri={mockShareAri}
        shareContentType={mockShareContentType}
        shareLink={mockShareLink}
        shareTitle={mockShareTitle}
        showFlags={mockShowFlags}
        formatCopyLink={mockFormatCopyLink}
        shouldCloseOnEscapePress={mockShouldCloseOnEscapePress}
      />,
    );

    const client: ShareServiceExports.ShareClient =
      // @ts-ignore: accessing private variable for testing purpose
      newWrapper.instance().client;
    expect(client.getConfig).toEqual(mockGetConfig);
    expect(client.share).toEqual(mockShare);
  });

  describe('isFetchingConfig state', () => {
    it('should be false by default', () => {
      expect((wrapper.state() as State).isFetchingConfig).toBe(false);
    });

    it('should be passed into isFetchingConfig prop in ShareDialogWithTrigger', () => {
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
      wrapper.instance().fetchConfig();
      expect(wrapper.state().isFetchingConfig).toBe(true);
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(wrapper.state().isFetchingConfig).toBe(false);
    });
  });

  it('should reset the state.config to default config if client.getConfig failed', async () => {
    mockGetConfig.mockRejectedValueOnce(new Error('error'));
    wrapper.setState({ config: mockConfig });
    wrapper.instance().fetchConfig();
    expect(wrapper.state().isFetchingConfig).toBe(true);
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(wrapper.state().config).toMatchObject(defaultConfig);
    expect(wrapper.state().isFetchingConfig).toBe(false);
  });

  describe('handleSubmitShare', () => {
    it('should call share function from this.client', () => {
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
});
