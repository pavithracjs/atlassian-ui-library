// @flow
import React from 'react';
import { mount } from 'enzyme';

import { PopupSelect } from '../../..';

const OPTIONS = [
  { label: '0', value: 'zero' },
  { label: '1', value: 'one' },
  { label: '2', value: 'two' },
  { label: '3', value: 'three' },
  { label: '4', value: 'four' },
];

const addedListeners = () => {
  const { calls } = global.window.addEventListener.mock;
  const results = calls.filter(call => call[0] !== 'error');
  return results;
};

const removedListeners = () => {
  const { calls } = global.window.removeEventListener.mock;
  const results = calls.filter(call => call[0] !== 'error');
  return results;
};

describe('Popup Select', () => {
  beforeEach(() => {
    jest.spyOn(global.window, 'addEventListener');
    jest.spyOn(global.window, 'removeEventListener');
  });

  afterEach(() => {
    global.window.addEventListener.mockRestore();
    global.window.removeEventListener.mockRestore();
  });

  it('stays open when cleared', () => {
    const atlaskitSelectWrapper = mount(
      <PopupSelect
        options={OPTIONS}
        value={OPTIONS[0]}
        isClearable
        target={({ ref }) => <button ref={ref}>Target</button>}
      />,
    );
    atlaskitSelectWrapper.setState({ isOpen: true });
    // Check ClearIndicator exists
    expect(atlaskitSelectWrapper.find('ClearIndicator').exists()).toBeTruthy();
    atlaskitSelectWrapper.find('ClearIndicator').prop('clearValue')();
    // Menu should still be open
    expect(atlaskitSelectWrapper.find('Menu').exists()).toBeTruthy();
  });

  it('cleans up event listeners', () => {
    const atlaskitSelectWrapper = mount(
      <PopupSelect
        options={OPTIONS}
        value={OPTIONS[0]}
        isClearable
        target={({ ref }) => <button ref={ref}>Target</button>}
      />,
    );

    expect(addedListeners().length).toBe(1);
    atlaskitSelectWrapper.unmount();
    expect(removedListeners().length).toBe(2);
  });

  it('cleans up event listeners added after being opened', () => {
    const atlaskitSelectWrapper = mount(
      <PopupSelect
        options={OPTIONS}
        value={OPTIONS[0]}
        isClearable
        target={({ ref }) => <button ref={ref}>Target</button>}
      />,
    );

    atlaskitSelectWrapper.setState({ isOpen: true });
    expect(addedListeners().length).toBe(3);
    atlaskitSelectWrapper.unmount();
    expect(removedListeners().length).toBe(4);
  });
});
