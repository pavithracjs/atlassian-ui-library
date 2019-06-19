// @flow
import React from 'react';
import { mount, shallow } from 'enzyme';

import ContentNavigation from '../../index';
import { transitionDurationMs } from '../../../../../common/constants';

const defaultProps = {
  isVisible: false,
  product: () => null,
};

describe('ContentNavigation', () => {
  it('should not trigger animations on first-page load', () => {
    const wrapper = shallow(<ContentNavigation {...defaultProps} />);

    expect(wrapper.find('Transition').props().timeout).toBe(0);

    wrapper.setProps({ isVisible: true });

    expect(wrapper.find('Transition').props().timeout).toBe(
      transitionDurationMs,
    );
  });

  it('should continue rendering the container view while the container layer animates out', async () => {
    const Container = () => null;
    const wrapper = mount(<ContentNavigation {...defaultProps} isVisible />);

    expect(wrapper.find(Container)).toHaveLength(0);
    wrapper.setProps({ container: Container });
    expect(wrapper.find(Container)).toHaveLength(1);
    wrapper.setProps({ container: undefined });
    // Should continue rendering the Container even though we've unset the prop
    expect(wrapper.find(Container)).toHaveLength(1);
  });

  it('should visually hide the container view when nav is collapsed', () => {
    const Container = () => null;
    const wrapper = mount(
      <ContentNavigation container={Container} {...defaultProps} isVisible />,
    );
    expect(wrapper.find(Container).length).toBe(1);
    expect(
      wrapper
        .find(Container)
        .parent()
        .is('div'),
    ).toBeFalsy();

    wrapper.setProps({ isVisible: false });
    expect(wrapper.find(Container).length).toBe(1);
    expect(
      wrapper
        .find(Container)
        .parent()
        .is('div'),
    ).toBeTruthy();
    expect(wrapper.find(Container).parent()).toMatchSnapshot();
  });

  it('should visually hide the product view when nav is collapsed', () => {
    const Product = () => null;
    const wrapper = mount(<ContentNavigation product={Product} isVisible />);
    expect(wrapper.find(Product).length).toBe(1);
    expect(
      wrapper
        .find(Product)
        .parent()
        .is('div'),
    ).toBeFalsy();

    wrapper.setProps({ isVisible: false });

    expect(wrapper.find(Product).length).toBe(1);
    expect(
      wrapper
        .find(Product)
        .parent()
        .is('div'),
    ).toBeTruthy();
    expect(wrapper.find(Product).parent()).toMatchSnapshot();
  });
});
