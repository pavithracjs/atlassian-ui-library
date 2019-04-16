import { mount, shallow, ReactWrapper } from 'enzyme';
import * as React from 'react';
import FieldBase from '@atlaskit/field-base';
import Search from '../../Search';

describe('Search', () => {
  const isInputFocused = (wrapper: ReactWrapper) =>
    wrapper.find('input').getDOMNode() === document.activeElement;

  it('should auto focus on mount', () => {
    const wrapper = mount(<Search onInput={() => {}} onKeyDown={() => {}} />);

    expect(isInputFocused(wrapper)).toBe(true);
  });

  it('should pass on its isLoading prop to the internal FieldBase for it to handle', () => {
    expect(
      mount(<Search onInput={() => {}} onKeyDown={() => {}} isLoading />)
        .find(FieldBase)
        .at(0)
        .prop('isLoading'),
    ).toBe(true);
    expect(
      mount(
        <Search onInput={() => {}} onKeyDown={() => {}} isLoading={false} />,
      )
        .find(FieldBase)
        .at(0)
        .prop('isLoading'),
    ).toBe(false);
  });

  it('should render input controls if provided', () => {
    const wrapper = shallow(
      <Search inputControls={<button key="testKey">Test Btn</button>} />,
    );
    const inputControlsContainer = wrapper.find('SearchInputControlsContainer');

    expect(inputControlsContainer.length).toBe(1);
    expect(inputControlsContainer.children().length).toBe(1);
    expect(inputControlsContainer.childAt(0).key()).toBe('testKey');
  });
});
