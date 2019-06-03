import { shallowWithIntl } from '@atlaskit/editor-test-helpers';
import InlineDialog from '@atlaskit/inline-dialog';
import ShareIcon from '@atlaskit/icon/glyph/share';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps } from 'react-intl';
import ShareButton, {
  Props as ShareButtonProps,
} from '../../../components/ShareButton';
import {
  defaultShareContentState,
  Props,
  ShareDialogWithTrigger,
  State,
} from '../../../components/ShareDialogWithTrigger';
import { defaultConfig } from '../../../components/ShareDialogContainer';
import { ShareData, ShareForm } from '../../../components/ShareForm';
import { ConfigResponse } from '../../../clients/ShareServiceClient';
import { messages } from '../../../i18n';
import { DialogPlacement, ADMIN_NOTIFIED, OBJECT_SHARED } from '../../../types';
import mockPopper from '../_mockPopper';
mockPopper();

let wrapper: ShallowWrapper<Props & InjectedIntlProps>;
let mockOnShareSubmit: jest.Mock;
const mockLoadOptions = () => [];
const mockShowFlags: jest.Mock = jest.fn();
const mockFetchConfig: jest.Mock = jest.fn().mockResolvedValue(defaultConfig);

beforeEach(() => {
  wrapper = shallowWithIntl<Props>(
    <ShareDialogWithTrigger
      copyLink="copyLink"
      fetchConfig={mockFetchConfig}
      loadUserOptions={mockLoadOptions}
      onShareSubmit={mockOnShareSubmit}
      shareContentType="page"
      showFlags={mockShowFlags}
    />,
  )
    .dive()
    .dive()
    .dive()
    .dive();
});

beforeAll(() => {
  mockOnShareSubmit = jest.fn();
});

beforeEach(() => {
  mockFetchConfig.mockReset();
});

describe('ShareDialogWithTrigger', () => {
  describe('default', () => {
    it('should render', () => {
      expect(wrapper.find(InlineDialog).length).toBe(1);
      expect(wrapper.find(InlineDialog).prop('isOpen')).toBe(false);
      expect(wrapper.find(ShareForm).length).toBe(0);
      expect(wrapper.find(ShareButton).length).toBe(1);
    });
  });

  describe('isDialogOpen state', () => {
    it('should be false by default', () => {
      expect((wrapper.state() as State).isDialogOpen).toBe(false);
    });

    it('should be passed into isOpen prop InlineDialog and isSelected props in ShareButton', () => {
      let { isDialogOpen }: Partial<State> = wrapper.state();
      expect(isDialogOpen).toEqual(false);
      expect(wrapper.find(InlineDialog).prop('isOpen')).toEqual(isDialogOpen);
      expect(wrapper.find(ShareButton).prop('isSelected')).toEqual(
        isDialogOpen,
      );

      (wrapper as any).setState({ isDialogOpen: !isDialogOpen });

      expect(wrapper.find(InlineDialog).prop('isOpen')).toEqual(!isDialogOpen);
      expect(wrapper.find(ShareButton).prop('isSelected')).toEqual(
        !isDialogOpen,
      );
    });

    it('should be toggled if clicked on ShareButton', () => {
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
    });
  });

  describe('triggerButtonAppearance prop', () => {
    it('should pass to the value into ShareButton as appearance, and have a default value of "subtle"', () => {
      const newWrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      expect(
        newWrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('appearance'),
      ).toEqual('subtle');

      const mockAppearance = 'primary';
      newWrapper.setProps({ triggerButtonAppearance: mockAppearance });
      expect(
        newWrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('appearance'),
      ).toEqual(mockAppearance);
    });
  });

  describe('triggerButtonStyle prop', () => {
    it('should render only ShareIcon without text in the share button if the value is "icon-only"', () => {
      const newWrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          triggerButtonStyle="icon-only"
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      newWrapper.setState({ isDialogOpen: true });
      expect(
        newWrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('text'),
      ).toBeNull();
      expect(
        newWrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('iconBefore'),
      ).toEqual(<ShareIcon label="Share icon" />);
    });

    it('should render text in the share button if the value is "icon-with-text"', () => {
      const newWrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          triggerButtonStyle="icon-with-text"
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      newWrapper.setState({ isDialogOpen: true });
      expect(
        newWrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('text'),
      ).toEqual(<FormattedMessage {...messages.shareTriggerButtonText} />);
      expect(
        newWrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('iconBefore'),
      ).toEqual(<ShareIcon label="Share icon" />);
    });

    it('should render only text without ShareIcon in the share button if the value is "text-only"', () => {
      const newWrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          triggerButtonStyle="text-only"
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      newWrapper.setState({ isDialogOpen: true });
      expect(
        newWrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('text'),
      ).toEqual(<FormattedMessage {...messages.shareTriggerButtonText} />);
      expect(
        newWrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('iconBefore'),
      ).toBeUndefined();
    });
  });

  describe('dialogPlacement prop', () => {
    it('should be passed into InlineDialog component as placement prop', () => {
      const defaultPlacement: string = 'bottom-end';
      wrapper = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      expect(wrapper.find(InlineDialog).prop('placement')).toEqual(
        defaultPlacement,
      );
      const newPlacement: DialogPlacement = 'bottom-start';
      wrapper.setProps({ dialogPlacement: newPlacement });
      expect(wrapper.find(InlineDialog).prop('placement')).toEqual(
        newPlacement,
      );
    });
  });

  describe('isDisabled prop', () => {
    it('should be passed into ShareButton', () => {
      let isDisabled: boolean = false;
      wrapper = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          isDisabled={isDisabled}
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      let shareButtonProps: ShareButtonProps = wrapper
        .find(ShareButton)
        .props();
      expect(shareButtonProps.isDisabled).toEqual(isDisabled);

      wrapper.setProps({ isDisabled: !isDisabled });

      shareButtonProps = wrapper.find(ShareButton).props();
      expect(shareButtonProps.isDisabled).toEqual(!isDisabled);
    });
  });

  describe('renderCustomTriggerButton prop', () => {
    it('should render a ShareButton if children prop is not given', () => {
      expect(wrapper.find(ShareButton).length).toBe(1);
    });

    it('should call renderCustomTriggerButton prop if it is given', () => {
      const mockRenderCustomTriggerButton: jest.Mock = jest.fn(() => (
        <button />
      ));
      const wrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          renderCustomTriggerButton={mockRenderCustomTriggerButton}
          shareContentType="page"
          shareFormTitle="Share this page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      expect(mockRenderCustomTriggerButton).toHaveBeenCalledTimes(1);
      expect(mockRenderCustomTriggerButton).toHaveBeenCalledWith({
        error: (wrapper.state() as State).shareError,
        isSelected: (wrapper.state() as State).isDialogOpen,
        onClick: (wrapper.instance() as any).onTriggerClick,
      });
      expect(wrapper.find('button').length).toBe(1);
      expect(wrapper.find(ShareButton).length).toBe(0);
    });
  });

  describe('shareFormTitle prop', () => {
    it('should be passed to the ShareForm', () => {
      const wrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          shareFormTitle="Share this page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      wrapper.setState({ isDialogOpen: true });

      const ShareFormProps = shallow(wrapper
        .find(InlineDialog)
        .prop('content') as any)
        .find(ShareForm)
        .props();
      expect(ShareFormProps.title).toEqual('Share this page');
    });
  });

  describe('handleOpenDialog', () => {
    it('should set the isDialogOpen state to true', () => {
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
    });

    it.skip('should send an analytic event', () => {});
  });

  describe('handleCloseDialog', () => {
    it('should set the isDialogOpen state to false', () => {
      wrapper = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      wrapper.setState({ isDialogOpen: true });
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      wrapper
        .find(InlineDialog)
        .simulate('close', { isOpen: false, event: { type: 'submit' } });
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
    });

    it.skip('should send an analytic event', () => {});

    it('should be triggered when the InlineDialog is closed', () => {
      const mockClickEvent: Partial<Event> = {
        target: document.createElement('div'),
        type: 'click',
      };
      wrapper.setState({ isDialogOpen: true });
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      wrapper
        .find(InlineDialog)
        .simulate('close', { isOpen: false, event: mockClickEvent });
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
    });
  });

  describe('handleKeyDown', () => {
    const mockTarget = document.createElement('div');

    beforeEach(() => {
      (wrapper.instance() as any).containerRef = { current: mockTarget };
      wrapper.instance().forceUpdate();
    });

    it('should clear the state if an escape key is pressed down if event.preventDefault is false', () => {
      const escapeKeyDownEvent: Partial<KeyboardEvent> = {
        target: document.createElement('div'),
        type: 'keydown',
        key: 'Escape',
        stopPropagation: jest.fn(),
        defaultPrevented: false,
      };
      const mockShareData: ShareData = {
        users: [
          { type: 'user', id: 'id', name: 'name' },
          { type: 'email', id: 'email', name: 'email' },
        ],
        comment: {
          format: 'plain_text',
          value: 'comment',
        },
      };
      wrapper.setState({
        isDialogOpen: true,
        ignoreIntermediateState: false,
        defaultValue: mockShareData,
        shareError: new Error('unable to share'),
      });
      wrapper.find('div').simulate('keydown', escapeKeyDownEvent);
      expect(escapeKeyDownEvent.stopPropagation).toHaveBeenCalledTimes(1);
      expect((wrapper.state() as State).isDialogOpen).toBeFalsy();
      expect((wrapper.state() as State).ignoreIntermediateState).toBeTruthy();
      expect((wrapper.state() as State).defaultValue).toEqual(
        defaultShareContentState,
      );
      expect((wrapper.state() as State).shareError).toBeUndefined();
    });

    it('should not clear the state if an escape key is pressed if event.preventDefault is true', () => {
      const escapeKeyDownEvent: Partial<KeyboardEvent> = {
        target: document.createElement('div'),
        type: 'keydown',
        key: 'Escape',
        stopPropagation: jest.fn(),
        defaultPrevented: true,
      };
      const mockShareData: ShareData = {
        users: [
          { type: 'user', id: 'id', name: 'name' },
          { type: 'email', id: 'email', name: 'email' },
        ],
        comment: {
          format: 'plain_text',
          value: 'comment',
        },
      };
      const state = {
        isDialogOpen: true,
        ignoreIntermediateState: false,
        defaultValue: mockShareData,
        shareError: new Error('unable to share'),
      };
      wrapper.setState(state);
      wrapper.find('div').simulate('keydown', escapeKeyDownEvent);
      expect(escapeKeyDownEvent.stopPropagation).not.toHaveBeenCalled();
      expect(wrapper.state() as State).toMatchObject(state);
    });

    it('should clear the state if an escape key is pressed down on the container regardless of the event.preventDefault value', () => {
      const escapeKeyDownEvent: Partial<KeyboardEvent> = {
        target: mockTarget,
        type: 'keydown',
        key: 'Escape',
        stopPropagation: jest.fn(),
        defaultPrevented: true,
      };
      const mockShareData: ShareData = {
        users: [
          { type: 'user', id: 'id', name: 'name' },
          { type: 'email', id: 'email', name: 'email' },
        ],
        comment: {
          format: 'plain_text',
          value: 'comment',
        },
      };
      wrapper.setState({
        isDialogOpen: true,
        ignoreIntermediateState: false,
        defaultValue: mockShareData,
        shareError: new Error('unable to share'),
      });
      wrapper.find('div').simulate('keydown', escapeKeyDownEvent);
      expect(escapeKeyDownEvent.stopPropagation).toHaveBeenCalledTimes(1);
      expect((wrapper.state() as State).isDialogOpen).toBeFalsy();
      expect((wrapper.state() as State).ignoreIntermediateState).toBeTruthy();
      expect((wrapper.state() as State).defaultValue).toEqual(
        defaultShareContentState,
      );
      expect((wrapper.state() as State).shareError).toBeUndefined();
    });
  });

  describe('onTriggerClick', () => {
    it('should call props.fetchConfig only when isDialogOpen is set to be true', () => {
      wrapper.find(ShareButton).simulate('click');
      expect(mockFetchConfig).toHaveBeenCalledTimes(1);
      expect((wrapper.state() as State).isDialogOpen).toBe(true);

      wrapper.find(ShareButton).simulate('click');
      expect(mockFetchConfig).toHaveBeenCalledTimes(1);
      expect((wrapper.state() as State).isDialogOpen).toBe(false);
    });
  });

  describe('handleShareSubmit', () => {
    it('should call onSubmit props with an object of users and comment as an argument', () => {
      const mockOnSubmit: jest.Mock = jest.fn().mockResolvedValue({});
      const values: ShareData = {
        users: [
          { type: 'user', id: 'id', name: 'name' },
          { type: 'email', id: 'email', name: 'email' },
        ],
        comment: {
          format: 'plain_text',
          value: 'comment',
        },
      };
      const mockState: Partial<State> = {
        isDialogOpen: true,
        isSharing: false,
        ignoreIntermediateState: false,
        defaultValue: defaultShareContentState,
      };
      wrapper = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          onShareSubmit={mockOnSubmit}
          loadUserOptions={mockLoadOptions}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      wrapper.setState(mockState);

      shallow(wrapper.find(InlineDialog).prop('content') as any)
        .find(ShareForm)
        .simulate('shareClick', values);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(values);
    });

    it('should close inline dialog and reset the state and call props.showFlags when onSubmit resolves a value', async () => {
      const mockOnSubmit: jest.Mock = jest.fn().mockResolvedValue({});
      const mockConfig: ConfigResponse = {
        allowComment: false,
        allowedDomains: [],
        mode: 'DOMAIN_BASED_INVITE' as 'DOMAIN_BASED_INVITE',
      };
      const values: ShareData = {
        users: [
          { type: 'user', id: 'id', name: 'name' },
          { type: 'email', id: 'email@atlassian.com', name: 'email' },
        ],
        comment: {
          format: 'plain_text',
          value: 'comment',
        },
      };
      const mockState: Partial<State> = {
        isDialogOpen: true,
        isSharing: false,
        ignoreIntermediateState: false,
        defaultValue: values,
        shareError: { message: 'unable to share' },
      };
      wrapper = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          config={mockConfig}
          copyLink="copyLink"
          fetchConfig={mockFetchConfig}
          onShareSubmit={mockOnSubmit}
          loadUserOptions={mockLoadOptions}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
        .dive()
        .dive()
        .dive()
        .dive();
      wrapper.setState(mockState);

      mockShowFlags.mockReset();

      shallow(wrapper.find(InlineDialog).prop('content') as any)
        .find(ShareForm)
        .simulate('shareClick', values);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(values);

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(wrapper.state('isDialogOpen')).toBeFalsy();
      expect(wrapper.state('defaultValue')).toEqual(defaultShareContentState);
      expect(wrapper.state('ignoreIntermediateState')).toBeTruthy();
      expect(wrapper.state('isDialogOpen')).toBeFalsy();
      expect(wrapper.state('isSharing')).toBeFalsy();
      expect(wrapper.state('shareError')).toBeUndefined();
      expect(mockShowFlags).toHaveBeenCalledTimes(1);
      expect(mockShowFlags).toHaveBeenCalledWith([
        {
          appearance: 'success',
          title: {
            ...messages.adminNotifiedMessage,
            defaultMessage: expect.any(String),
          },
          type: ADMIN_NOTIFIED,
        },
        {
          appearance: 'success',
          title: expect.objectContaining({
            ...messages.shareSuccessMessage,
            defaultMessage: expect.any(String),
          }),
          type: OBJECT_SHARED,
        },
      ]);

      wrapper.setProps({
        config: {
          allowComment: false,
          mode: 'ANYONE' as 'ANYONE',
        },
      });

      mockShowFlags.mockReset();

      shallow(wrapper.find(InlineDialog).prop('content') as any)
        .find(ShareForm)
        .simulate('shareClick', values);

      await new Promise(resolve => setTimeout(resolve, 0));

      expect(mockShowFlags).toHaveBeenCalledTimes(1);
      expect(mockShowFlags).toHaveBeenCalledWith([
        {
          appearance: 'success',
          title: {
            ...messages.shareSuccessMessage,
            defaultMessage: expect.any(String),
          },
          type: OBJECT_SHARED,
        },
      ]);
    });
  });
});
