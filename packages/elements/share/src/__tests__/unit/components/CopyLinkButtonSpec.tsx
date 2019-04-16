// This works only by calling before importing InlineDialog
import mockPopper from '../_mockPopper';
mockPopper();

import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import InlineDialog from '@atlaskit/inline-dialog';
import { ReactWrapper } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import * as React from 'react';
import { InjectedIntlProps } from 'react-intl';
import {
  AUTO_DISMISS_MS,
  Props,
  State,
  CopyLinkButton,
  HiddenInput,
  MessageContainer,
} from '../../../components/CopyLinkButton';
import Button from '../../../components/styles';

describe('CopyLinkButton', () => {
  let originalExecCommand: (
    commandId: string,
    showUI?: boolean,
    value?: string,
  ) => boolean;
  let mockLink: string = 'link';
  const spiedExecCommand: jest.Mock = jest.fn();

  beforeAll(() => {
    originalExecCommand = document.execCommand;
    document.execCommand = spiedExecCommand;
  });

  afterEach(() => {
    spiedExecCommand.mockReset();
  });

  afterAll(() => {
    document.execCommand = originalExecCommand;
  });

  it('should render', () => {
    const wrapper: ReactWrapper<
      Props & InjectedIntlProps,
      State,
      any
    > = mountWithIntl<Props, State>(<CopyLinkButton link={mockLink} />);

    const inlineDialog = wrapper.find(InlineDialog);
    expect(inlineDialog).toHaveLength(1);
    expect(inlineDialog.prop('placement')).toEqual('top-start');

    const button = wrapper.find(Button);
    expect(button).toHaveLength(1);
    expect(button.prop('appearance')).toEqual('subtle-link');

    const hiddenInput = wrapper.find(HiddenInput);
    expect(hiddenInput).toHaveLength(1);
    expect(hiddenInput.prop('text')).toEqual(mockLink);

    expect(
      // @ts-ignore accessing private property just for testing purpose
      wrapper.instance().inputRef.current instanceof HTMLInputElement,
    ).toBeTruthy();
  });

  describe('componentWillUnmount', () => {
    it('should clear this.autoDismiss', () => {
      const wrapper: ReactWrapper<
        Props & InjectedIntlProps,
        State,
        any
      > = mountWithIntl<Props, State>(<CopyLinkButton link={mockLink} />);
      wrapper.find(Button).simulate('click');
      expect(wrapper.instance().autoDismiss).not.toBeUndefined();
      wrapper.instance().componentWillUnmount();
      expect(wrapper.instance().autoDismiss).toBeUndefined();
    });
  });

  describe('shouldShowCopiedMessage state', () => {
    it('should render the copied to clip board message, and dismiss the message when click outside the Inline Dialog', () => {
      const eventMap: { click: Function } = { click: () => {} };
      window.addEventListener = jest.fn(
        (event: 'click', cb: Function) => (eventMap[event] = cb),
      );

      const wrapper: ReactWrapper<
        Props & InjectedIntlProps,
        State,
        any
      > = mountWithIntl<Props, State>(<CopyLinkButton link={mockLink} />);
      wrapper.find(Button).simulate('click');
      expect(wrapper.find(CheckCircleIcon)).toHaveLength(1);
      expect(wrapper.find(MessageContainer)).toHaveLength(1);
      expect(wrapper.instance().autoDismiss).not.toBeUndefined();

      const clickEventOutsideMessageContainer: Partial<Event> = {
        target: document.createElement('div'),
        type: 'click',
      };
      eventMap.click(clickEventOutsideMessageContainer);

      wrapper.update();

      expect(wrapper.state().shouldShowCopiedMessage).toBeFalsy();
      expect(wrapper.find(CheckCircleIcon)).toHaveLength(0);
      expect(wrapper.find(MessageContainer)).toHaveLength(0);
      expect(wrapper.instance().autoDismiss).toBeUndefined();
    });
  });

  describe('handleClick', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should copy the text from the HiddenInput and call onLinkCopy prop if given when the user clicks on the button', () => {
      const spiedOnLinkCopy: jest.Mock = jest.fn();
      const wrapper: ReactWrapper<
        Props & InjectedIntlProps,
        State,
        any
      > = mountWithIntl<Props, State>(
        <CopyLinkButton onLinkCopy={spiedOnLinkCopy} link={mockLink} />,
      );
      const spiedInputSelect: jest.SpyInstance = jest.spyOn(
        // @ts-ignore accessing private property just for testing purpose
        wrapper.instance().inputRef.current,
        'select',
      );
      wrapper.find(Button).simulate('click');
      expect(spiedInputSelect).toHaveBeenCalledTimes(1);
      expect(spiedExecCommand).toHaveBeenCalledTimes(1);
      expect(spiedOnLinkCopy).toHaveBeenCalledTimes(1);
      expect(spiedOnLinkCopy.mock.calls[0][0]).toEqual(mockLink);
      expect(wrapper.state().shouldShowCopiedMessage).toBeTruthy();

      jest.runOnlyPendingTimers();
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(
        expect.any(Function),
        AUTO_DISMISS_MS,
      );
      expect(wrapper.state().shouldShowCopiedMessage).toBeFalsy();
    });
  });
});
