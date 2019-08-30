import { shallowWithIntl } from '@atlaskit/editor-test-helpers';
import ShareIcon from '@atlaskit/icon/glyph/share';
import InlineDialog from '@atlaskit/inline-dialog';
import Aktooltip from '@atlaskit/tooltip';
import { shallow, ShallowWrapper } from 'enzyme';
import * as React from 'react';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { ConfigResponse } from '../../../clients/ShareServiceClient';
import ShareButton, {
  Props as ShareButtonProps,
} from '../../../components/ShareButton';
import {
  defaultShareContentState,
  Props,
  ShareDialogWithTriggerInternal,
  State,
} from '../../../components/ShareDialogWithTrigger';
import { ShareData, ShareForm } from '../../../components/ShareForm';
import { messages } from '../../../i18n';
import {
  ADMIN_NOTIFIED,
  DialogPlacement,
  OBJECT_SHARED,
  RenderCustomTriggerButton,
  TooltipPosition,
} from '../../../types';
import { Omit, PropsOf } from '../_testUtils';
import mockPopper from '../_mockPopper';
mockPopper();

describe('ShareDialogWithTrigger', () => {
  let mockCreateAnalyticsEvent: jest.Mock;
  let mockOnShareSubmit: jest.Mock = jest.fn();
  const mockLoadOptions = () => [];
  const mockShowFlags: jest.Mock = jest.fn();
  const mockOnDialogOpen: jest.Mock = jest.fn();

  function getWrapper(
    overrides: Partial<
      Omit<PropsOf<ShareDialogWithTriggerInternal>, 'intl'>
    > = {},
  ): ShallowWrapper<Props & InjectedIntlProps> {
    let props: Omit<PropsOf<ShareDialogWithTriggerInternal>, 'intl'> = {
      copyLink: 'copyLink',
      loadUserOptions: mockLoadOptions,
      onDialogOpen: mockOnDialogOpen,
      onShareSubmit: mockOnShareSubmit,
      shareContentType: 'page',
      showFlags: mockShowFlags,
      createAnalyticsEvent: mockCreateAnalyticsEvent,

      ...overrides,
    };

    const WithIntl = injectIntl(ShareDialogWithTriggerInternal);

    return shallowWithIntl<Props>(<WithIntl {...props} />);
  }

  beforeEach(() => {
    mockCreateAnalyticsEvent = jest.fn<{}>().mockReturnValue({
      fire: jest.fn(),
    });
    mockOnShareSubmit.mockReset();
    mockShowFlags.mockReset();
    mockOnDialogOpen.mockReset();
  });

  describe('default', () => {
    it('should render', () => {
      const wrapper = getWrapper();
      expect(wrapper.find(InlineDialog).length).toBe(1);
      expect(wrapper.find(InlineDialog).prop('isOpen')).toBe(false);
      expect(wrapper.find(ShareForm).length).toBe(0);
      expect(wrapper.find(ShareButton).length).toBe(1);
    });
  });

  describe('isDialogOpen state', () => {
    it('should be false by default', () => {
      const wrapper = getWrapper();
      expect((wrapper.state() as State).isDialogOpen).toBe(false);
    });

    it('should be passed into isOpen prop InlineDialog and isSelected props in ShareButton', () => {
      const wrapper = getWrapper();
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
      const wrapper = getWrapper();
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
    });
  });

  describe('triggerButtonAppearance prop', () => {
    it('should pass to the value into ShareButton as appearance, and have a default value of "subtle"', () => {
      const wrapper = getWrapper();
      expect(
        wrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('appearance'),
      ).toEqual('subtle');

      const mockAppearance = 'primary';
      wrapper.setProps({ triggerButtonAppearance: mockAppearance });
      expect(
        wrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('appearance'),
      ).toEqual(mockAppearance);
    });
  });

  describe('triggerButtonStyle prop', () => {
    it('should render only ShareIcon without text in the share button if the value is "icon-only"', () => {
      const wrapper = getWrapper({
        triggerButtonStyle: 'icon-only',
      });
      wrapper.setState({ isDialogOpen: true });
      expect(
        wrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('text'),
      ).toBeNull();
      expect(
        wrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('iconBefore'),
      ).toEqual(<ShareIcon label="Share icon" />);
    });

    it('should render text in the share button if the value is "icon-with-text"', () => {
      const wrapper = getWrapper({
        triggerButtonStyle: 'icon-with-text',
      });
      wrapper.setState({ isDialogOpen: true });
      expect(
        wrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('text'),
      ).toEqual(<FormattedMessage {...messages.shareTriggerButtonText} />);
      expect(
        wrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('iconBefore'),
      ).toEqual(<ShareIcon label="Share icon" />);
    });

    it('should render only text without ShareIcon in the share button if the value is "text-only"', () => {
      const wrapper = getWrapper({
        triggerButtonStyle: 'text-only',
      });
      wrapper.setState({ isDialogOpen: true });
      expect(
        wrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('text'),
      ).toEqual(<FormattedMessage {...messages.shareTriggerButtonText} />);
      expect(
        wrapper
          .find(InlineDialog)
          .find(ShareButton)
          .prop('iconBefore'),
      ).toBeUndefined();
    });
  });

  describe('dialogPlacement prop', () => {
    it('should be passed into InlineDialog component as placement prop', () => {
      const defaultPlacement: string = 'bottom-end';
      const wrapper = getWrapper();
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
      const wrapper = getWrapper({
        isDisabled,
      });
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
      const wrapper = getWrapper();
      expect(wrapper.find(ShareButton).length).toBe(1);
    });

    it('should call renderCustomTriggerButton prop if it is given', () => {
      const mockRenderCustomTriggerButton: jest.Mock = jest.fn(() => (
        <button />
      ));
      const wrapper = getWrapper({
        renderCustomTriggerButton: mockRenderCustomTriggerButton,
        shareFormTitle: 'Share this page',
      });
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
      const wrapper = getWrapper({
        shareFormTitle: 'Share this page',
      });
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
      const wrapper = getWrapper();
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
    });

    it('should call the onDialogOpen prop if present', () => {
      const wrapper = getWrapper();
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
      expect(mockOnDialogOpen).not.toHaveBeenCalled();

      wrapper.find(ShareButton).simulate('click');
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      expect(mockOnDialogOpen).toHaveBeenCalledTimes(1);
    });

    it('should send an analytic event', () => {
      const wrapper = getWrapper();
      expect(mockCreateAnalyticsEvent).not.toHaveBeenCalled();

      wrapper.find(ShareButton).simulate('click');
      expect(mockCreateAnalyticsEvent).toHaveBeenCalledTimes(2);
      // Share button clicked event
      expect(mockCreateAnalyticsEvent.mock.calls[0][0]).toMatchObject({
        eventType: 'ui',
        action: 'clicked',
        actionSubject: 'button',
        actionSubjectId: 'share',
        attributes: {
          packageName: expect.any(String),
          packageVersion: expect.any(String),
        },
      });
      // Share modal screen event
      expect(mockCreateAnalyticsEvent.mock.calls[1][0]).toMatchObject({
        eventType: 'screen',
        name: 'shareModal',
        attributes: {
          packageName: expect.any(String),
          packageVersion: expect.any(String),
        },
      });
    });
  });

  describe('handleCloseDialog', () => {
    it('should set the isDialogOpen state to false', () => {
      const wrapper = getWrapper();
      wrapper.setState({ isDialogOpen: true });
      expect((wrapper.state() as State).isDialogOpen).toEqual(true);
      wrapper
        .find(InlineDialog)
        .simulate('close', { isOpen: false, event: { type: 'submit' } });
      expect((wrapper.state() as State).isDialogOpen).toEqual(false);
    });

    it('should be triggered when the InlineDialog is closed', () => {
      const wrapper = getWrapper();
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

    function getWrapperWithRef() {
      const wrapper = getWrapper();
      (wrapper.instance() as any).containerRef = { current: mockTarget };
      wrapper.instance().forceUpdate();
      return wrapper;
    }

    it('should clear the state if an escape key is pressed down if event.preventDefault is false', () => {
      const wrapper = getWrapperWithRef();
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
      wrapper
        .dive()
        .find('div')
        .simulate('keydown', escapeKeyDownEvent);
      expect(escapeKeyDownEvent.stopPropagation).toHaveBeenCalledTimes(1);
      expect((wrapper.state() as State).isDialogOpen).toBeFalsy();
      expect((wrapper.state() as State).ignoreIntermediateState).toBeTruthy();
      expect((wrapper.state() as State).defaultValue).toEqual(
        defaultShareContentState,
      );
      expect((wrapper.state() as State).shareError).toBeUndefined();
    });

    it('should not clear the state if an escape key is pressed if event.preventDefault is true', () => {
      const wrapper = getWrapperWithRef();
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
      wrapper
        .dive()
        .find('div')
        .simulate('keydown', escapeKeyDownEvent);
      expect(escapeKeyDownEvent.stopPropagation).not.toHaveBeenCalled();
      expect(wrapper.state() as State).toMatchObject(state);
    });

    it('should clear the state if an escape key is pressed down on the container regardless of the event.preventDefault value', () => {
      const wrapper = getWrapperWithRef();
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
      wrapper
        .dive()
        .find('div')
        .simulate('keydown', escapeKeyDownEvent);
      expect(escapeKeyDownEvent.stopPropagation).toHaveBeenCalledTimes(1);
      expect((wrapper.state() as State).isDialogOpen).toBeFalsy();
      expect((wrapper.state() as State).ignoreIntermediateState).toBeTruthy();
      expect((wrapper.state() as State).defaultValue).toEqual(
        defaultShareContentState,
      );
      expect((wrapper.state() as State).shareError).toBeUndefined();
    });
  });

  describe('handleShareSubmit', () => {
    it('should call onSubmit props with an object of users and comment as an argument', () => {
      const mockOnSubmit = jest.fn<{}>().mockResolvedValue({});
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
      const wrapper = getWrapper({
        onShareSubmit: mockOnSubmit,
      });
      wrapper.setState(mockState);

      shallow(wrapper.find(InlineDialog).prop('content') as any)
        .find(ShareForm)
        .simulate('submit', values);
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(values);
    });

    it('should close inline dialog and reset the state and call props.showFlags when onSubmit resolves a value', async () => {
      const mockOnSubmit = jest.fn<{}>().mockResolvedValue({});
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
      const wrapper = getWrapper({
        config: mockConfig,
        onShareSubmit: mockOnSubmit,
      });
      wrapper.setState(mockState);

      mockShowFlags.mockReset();

      shallow(wrapper.find(InlineDialog).prop('content') as any)
        .find(ShareForm)
        .simulate('submit', values);
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
        .simulate('submit', values);

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

  describe('Aktooltip', () => {
    it('should be rendered if the props.triggerButtonStyle is `icon-only`', () => {
      const wrapper = getWrapper({
        triggerButtonStyle: 'icon-only',
      });
      expect(wrapper.dive().find(Aktooltip)).toHaveLength(1);
      expect(
        wrapper
          .dive()
          .find(Aktooltip)
          .find(ShareButton),
      ).toHaveLength(1);

      wrapper.setProps({ triggerButtonStyle: 'icon-with-text' });
      expect(wrapper.dive().find(Aktooltip)).toHaveLength(0);
      expect(wrapper.dive().find(ShareButton)).toHaveLength(1);

      wrapper.setProps({ triggerButtonStyle: 'text-only' });
      expect(wrapper.dive().find(Aktooltip)).toHaveLength(0);
      expect(wrapper.dive().find(ShareButton)).toHaveLength(1);

      const MockCustomButton = () => <button />;
      const renderCustomTriggerButton: RenderCustomTriggerButton = ({
        onClick = () => {},
      }) => <MockCustomButton />;

      wrapper.setProps({
        triggerButtonStyle: 'icon-only',
        renderCustomTriggerButton,
      });

      expect(wrapper.dive().find(Aktooltip)).toHaveLength(1);
      expect(
        wrapper
          .dive()
          .find(Aktooltip)
          .find(MockCustomButton),
      ).toHaveLength(1);
    });

    it('should digest props.triggerButtonTooltipText as content and props.triggerButtonTooltipPosition as position', () => {
      const wrapper = getWrapper({
        triggerButtonStyle: 'icon-only',
      });
      expect(
        (wrapper
          .dive()
          .find(Aktooltip)
          .props() as any).content,
      ).toEqual('Share');
      expect(
        (wrapper
          .dive()
          .find(Aktooltip)
          .props() as any).position,
      ).toEqual('top');

      const customTooltipText = 'Custom Share';
      const customTooltipPosition: TooltipPosition = 'mouse';

      wrapper.setProps({
        triggerButtonTooltipText: customTooltipText,
        triggerButtonTooltipPosition: customTooltipPosition,
      });

      expect(
        (wrapper
          .dive()
          .find(Aktooltip)
          .props() as any).content,
      ).toEqual('Custom Share');
      expect(
        (wrapper
          .dive()
          .find(Aktooltip)
          .props() as any).position,
      ).toEqual('mouse');
    });
  });

  describe('bottomMessage', () => {
    it('should display the bottom message', () => {
      const wrapper = getWrapper({
        bottomMessage: 'Some message',
      });
      wrapper.setState({ isDialogOpen: true });

      const content = shallow(wrapper
        .find(InlineDialog)
        .prop('content') as any);
      expect(content.contains('Some message')).toBeTruthy();
    });
  });
});
