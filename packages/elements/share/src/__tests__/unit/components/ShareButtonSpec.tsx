import Button from '@atlaskit/button';
import ShareIcon from '@atlaskit/icon/glyph/share';
import { mountWithIntl, shallowWithIntl } from '@atlaskit/editor-test-helpers';

import * as React from 'react';
import { InjectedIntlProps } from 'react-intl';
import { ReactWrapper, ShallowWrapper } from 'enzyme';

import ShareButton, { Props } from '../../../components/ShareButton';

const noop: any = () => {};

describe('ShareButton', () => {
  describe('default', () => {
    it('should render a Button with a ShareIcon', () => {
      const wrapper: ReactWrapper<
        Props & InjectedIntlProps,
        {},
        any
      > = mountWithIntl(<ShareButton onClick={noop} />);
      expect(wrapper.find(Button).length).toBe(1);
      expect(wrapper.find(Button).prop('iconBefore')).toBeDefined();
      expect(wrapper.find(ShareIcon).length).toBe(1);
    });

    it('should proxy appearance, isSelected and isDisable props into Button component', () => {
      const propsToBeProxied: Partial<Props> = {
        appearance: 'primary',
        isSelected: false,
        isDisabled: false,
      };
      const wrapper: ReactWrapper<
        Props & InjectedIntlProps,
        {},
        any
      > = mountWithIntl(<ShareButton {...propsToBeProxied} onClick={noop} />);
      let buttonProps: any = wrapper.find(Button).props();

      expect(buttonProps).toMatchObject(propsToBeProxied);

      const newPropsToBeProxied: any = {
        appearance: 'warning',
        isSelected: !propsToBeProxied.isSelected,
        isDisabled: !propsToBeProxied.isDisabled,
      };
      wrapper.setProps(newPropsToBeProxied);
      buttonProps = wrapper.find(Button).props();

      expect(buttonProps).toMatchObject(newPropsToBeProxied);
    });
  });

  describe('text prop', () => {
    it('should be rendered if given', () => {
      const wrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl(<ShareButton text="Share" onClick={noop} />);
      expect(wrapper.find(Button).text()).toEqual('Share');
    });

    it('should not render any text if text prop is not given', () => {
      const wrapper: ShallowWrapper<
        Props & InjectedIntlProps
      > = shallowWithIntl(<ShareButton onClick={noop} />);
      expect(wrapper.find(Button).text()).toEqual('');
    });
  });

  describe('onClick prop', () => {
    it('should be called when the button is clicked', () => {
      const spiedOnClick: jest.Mock = jest.fn();
      const wrapper: ReactWrapper<
        Props & InjectedIntlProps,
        {},
        any
      > = mountWithIntl(<ShareButton onClick={spiedOnClick} />);
      wrapper.find(Button).simulate('click');
      expect(spiedOnClick).toHaveBeenCalledTimes(1);
    });
  });
});
