import * as React from 'react';
import SpaceFilter from '../../../components/confluence/SpaceFilter';
import { shallow } from 'enzyme';

const onFilterChanged = jest.fn();
const render = () => {
  return shallow(
    <SpaceFilter
      spaceTitle="Test space"
      spaceAvatar="test.png"
      spaceKey="TEST"
      onFilterChanged={onFilterChanged}
    />,
  );
};

describe('ConfluenceSpaceFilter', () => {
  it('should render space filter correctly', () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });
  it('should call onFilterChanged when clicked', () => {
    const wrapper = render();
    wrapper
      .find('WithItemFocus(Item)')
      .at(0)
      .simulate('click');
    expect(onFilterChanged).toHaveBeenCalled();
  });
});
