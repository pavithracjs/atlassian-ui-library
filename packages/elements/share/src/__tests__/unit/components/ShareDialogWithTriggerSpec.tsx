import { shallowWithIntl } from '@atlaskit/editor-test-helpers';
import InlineDialog from '@atlaskit/inline-dialog';
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
import { ShareData, ShareForm } from '../../../components/ShareForm';
import { messages } from '../../../i18n';
import { DialogPlacement, ADMIN_NOTIFIED, OBJECT_SHARED } from '../../../types';
import mockPopper from '../_mockPopper';
mockPopper();

let wrapper: ShallowWrapper<Props & InjectedIntlProps>;
let mockOnShareSubmit: jest.Mock;
const mockLoadOptions = () => [];
const mockShowFlags: jest.Mock = jest.fn();

beforeEach(() => {
  wrapper = shallowWithIntl<Props>(
    <ShareDialogWithTrigger
      copyLink="copyLink"
      loadUserOptions={mockLoadOptions}
      onShareSubmit={mockOnShareSubmit}
      shareContentType="page"
      showFlags={mockShowFlags}
    />,
  )
    .dive()
    .dive()
    .dive();
});

beforeAll(() => {
  mockOnShareSubmit = jest.fn();
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
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
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
    it('should render no text in the share button if the value is "icon-only"', () => {
      const newWrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          triggerButtonStyle="icon-only"
          copyLink="copyLink"
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
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
    });

    it('should render text in the share button if the value is "icon-with-text"', () => {
      const newWrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          triggerButtonStyle="icon-with-text"
          copyLink="copyLink"
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
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
    });
  });

  describe('children prop', () => {
    it('should render a ShareButton if children prop is not given', () => {
      expect(wrapper.find(ShareButton).length).toBe(1);
    });

    it('should be called with the this.handleOpenDialog function as argument if given', () => {
      const spiedRenderer: jest.Mock = jest.fn();
      wrapper = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        >
          {spiedRenderer}
        </ShareDialogWithTrigger>,
      )
        .dive()
        .dive()
        .dive();
      const wrapperState: State = wrapper.state() as State;
      expect(spiedRenderer).toHaveBeenCalledTimes(1);
      expect(spiedRenderer).toHaveBeenCalledWith(
        expect.objectContaining({
          onClick: expect.any(Function),
          loading: wrapperState.isSharing,
          error: wrapperState.shareError,
        }),
      );
    });
  });

  describe('dialogPlacement prop', () => {
    it('should be passed into InlineDialog component as placement prop', () => {
      const defaultPlacement: string = 'bottom-end';
      wrapper = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
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
          isDisabled={isDisabled}
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
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

  describe('shareFormTitle prop', () => {
    it('should be passed to the ShareForm', () => {
      const wrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          shareFormTitle="Share this page"
          showFlags={mockShowFlags}
        />,
      )
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
          loadUserOptions={mockLoadOptions}
          onShareSubmit={mockOnShareSubmit}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
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
    it('should clear the state if an escape key is pressed down', () => {
      const escapeKeyDownEvent: Partial<KeyboardEvent> = {
        target: document,
        type: 'keydown',
        key: 'Escape',
        stopPropagation: jest.fn(),
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
          onShareSubmit={mockOnSubmit}
          loadUserOptions={mockLoadOptions}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
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
        defaultValue: values,
        shareError: { message: 'unable to share' },
      };
      wrapper = shallowWithIntl<Props>(
        <ShareDialogWithTrigger
          copyLink="copyLink"
          onShareSubmit={mockOnSubmit}
          loadUserOptions={mockLoadOptions}
          shareContentType="page"
          showFlags={mockShowFlags}
        />,
      )
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
          mode: 'INVITE_NEEDS_APPROVAL' as 'INVITE_NEEDS_APPROVAL',
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
            ...messages.adminNotifiedMessage,
            defaultMessage: expect.any(String),
          },
          type: ADMIN_NOTIFIED,
        },
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
