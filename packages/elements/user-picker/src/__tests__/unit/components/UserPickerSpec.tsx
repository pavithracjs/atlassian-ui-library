jest.mock('../../../components/styles', () => ({
  getStyles: jest.fn(),
}));

import Select from '@atlaskit/select';
import { shallow } from 'enzyme';
import * as debounce from 'lodash.debounce';
import * as React from 'react';
import { getStyles } from '../../../components/styles';
import { UserPicker } from '../../../components/UserPicker';
import { User, UserPickerProps as Props, UserOption } from '../../../types';
import { usersToOptions, userToOption } from '../../../components/utils';

describe('UserPicker', () => {
  const shallowUserPicker = (props: Partial<Props> = {}) =>
    shallow(<UserPicker {...props} />);

  const users: User[] = [
    {
      id: 'abc-123',
      name: 'Jace Beleren',
      nickname: 'jbeleren',
    },
    {
      id: '123-abc',
      name: 'Chandra Nalaar',
      nickname: 'cnalaar',
    },
  ];

  const userOptions: UserOption[] = usersToOptions(users);

  it('should render Select', () => {
    const component = shallowUserPicker({ users });
    const select = component.find(Select);
    expect(select.prop('options')).toEqual(userOptions);
    expect(getStyles).toHaveBeenCalledWith(350);
    expect(select.prop('menuPlacement')).toBeTruthy();
  });

  it('should disable picker if isDisabled is true', () => {
    const component = shallowUserPicker({ isDisabled: true });
    const select = component.find(Select);
    expect(select.prop('isDisabled')).toEqual(true);
  });

  it('should set width', () => {
    shallowUserPicker({ width: 500 });

    expect(getStyles).toHaveBeenCalledWith(500);
  });

  it('should set custom placeholder', () => {
    const custom = 'Custom';
    const component = shallowUserPicker({ placeholder: custom });
    const select = component.find(Select);
    expect(select.prop('placeholder')).toEqual(custom);
  });

  it('should pass custom no options message to picker', () => {
    const customMessage = 'Custom';
    const component = shallowUserPicker({ noOptionsMessage: customMessage });
    const select = component.find(Select);
    expect(select.prop('noOptionsMessage')).toBeInstanceOf(Function);
    const result = (select.prop('noOptionsMessage') as Function)();
    expect(result).toEqual(customMessage);
  });

  it('should trigger onChange with User', () => {
    const onChange = jest.fn();
    const component = shallowUserPicker({ onChange });

    const select = component.find(Select);
    select.simulate('change', userOptions[0], { action: 'select-option' });

    expect(onChange).toHaveBeenCalledWith(users[0], 'select-option');
  });

  it('should trigger props.onSelection if onChange with select-option action', () => {
    const onSelection = jest.fn();
    const component = shallowUserPicker({ onSelection });

    const select = component.find(Select);
    select.simulate('change', userOptions[0], { action: 'select-option' });

    expect(onSelection).toHaveBeenCalledWith(users[0]);
  });

  describe('Multiple users select', () => {
    it('should set isMulti in Select', () => {
      const component = shallowUserPicker({ users, isMulti: true });
      const select = component.find(Select);
      expect(select.prop('isMulti')).toBeTruthy();
    });

    it('should call onChange with an array of users', () => {
      const onChange = jest.fn();
      const component = shallowUserPicker({ users, isMulti: true, onChange });

      component
        .find(Select)
        .simulate('change', userOptions, { action: 'select-option' });

      expect(onChange).toHaveBeenCalledWith(
        [users[0], users[1]],
        'select-option',
      );
    });
  });

  it('should set hovering clear indicator', () => {
    const component = shallowUserPicker();
    const select = component.find(Select);
    select.simulate('clearIndicatorHover', true);
    expect(component.state()).toHaveProperty('hoveringClearIndicator', true);
  });

  it('should set isClearable to false', () => {
    const component = shallowUserPicker({ isClearable: false });
    const select = component.find(Select);
    expect(select.prop('isClearable')).toEqual(false);
  });

  it('should open menu onFocus', () => {
    const component = shallowUserPicker();
    const select = component.find(Select);
    select.simulate('focus', { target: {} });
    expect(component.state()).toHaveProperty('menuIsOpen', true);
  });

  it('should close menu onBlur', () => {
    const component = shallowUserPicker();
    component.setState({ menuIsOpen: true });
    const select = component.find(Select);
    select.simulate('blur');
    expect(component.state()).toHaveProperty('menuIsOpen', false);
  });

  describe('async load', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('should load users when picker open', () => {
      const usersPromise = new Promise<User[]>(resolve =>
        setTimeout(() => resolve(users), 500),
      );
      const loadUsers = jest.fn(() => usersPromise);
      const component = shallowUserPicker({ loadUsers });
      component.setProps({ open: true });
      jest.runAllTimers();
      expect(loadUsers).toHaveBeenCalled();
      return usersPromise.then(() => {
        jest.runAllTimers();
        expect(component.state()).toMatchObject({
          users,
        });
      });
    });

    describe('onInputChange', () => {
      it('should load users on input change', () => {
        const usersPromise = new Promise<User[]>(resolve =>
          setTimeout(() => resolve(users), 500),
        );
        const loadUsers = jest.fn(() => usersPromise);
        const component = shallowUserPicker({ loadUsers });
        const select = component.find(Select);
        select.simulate('inputChange', 'some text', { action: 'input-change' });
        jest.runAllTimers();
        expect(loadUsers).toHaveBeenCalled();
        expect(loadUsers).toHaveBeenCalledWith('some text');
        return usersPromise.then(() => {
          jest.runAllTimers();
          expect(component.state()).toMatchObject({
            users,
          });
        });
      });

      it('should call props.onInputChange', () => {
        const onInputChange = jest.fn();
        const component = shallowUserPicker({ onInputChange });
        const select = component.find(Select);
        select.simulate('inputChange', 'some text', { action: 'input-change' });
        expect(onInputChange).toHaveBeenCalled();
      });

      it('should debounce input change events', () => {
        const usersPromise = new Promise<User[]>(resolve =>
          setTimeout(() => resolve(users), 500),
        );
        const loadUsers = jest.fn(() => usersPromise);
        shallowUserPicker({ loadUsers });

        expect(debounce).toHaveBeenCalledWith(expect.any(Function), 200);
      });
    });
  });

  describe('with defaultOptions', () => {
    it('should render with default options', () => {
      const component = shallowUserPicker({
        isMulti: true,
        defaultValue: [users[0]],
      });

      expect(component.find(Select).prop('value')).toEqual([
        { label: 'Jace Beleren', user: users[0], value: 'abc-123' },
      ]);
    });

    it('should not remove fixed options', () => {
      const onChange = jest.fn();
      const component = shallowUserPicker({
        isMulti: true,
        defaultValue: [{ ...users[0], fixed: true }],
        onChange,
      });

      const select = component.find(Select);
      const fixedOption = userToOption({ ...users[0], fixed: true });
      expect(select.prop('value')).toEqual([fixedOption]);

      select.simulate('change', [], {
        action: 'pop-value',
        removedValue: fixedOption,
      });

      expect(onChange).not.toHaveBeenCalled();

      expect(select.prop('value')).toEqual([fixedOption]);
    });

    it('should not remove fixed options with other values', () => {
      const onChange = jest.fn();
      const fixedUser = { ...users[0], fixed: true };
      const component = shallowUserPicker({
        isMulti: true,
        defaultValue: [fixedUser],
        onChange,
      });

      const fixedOption = userToOption(fixedUser);
      expect(component.find(Select).prop('value')).toEqual([fixedOption]);

      const removableOption = userToOption(users[1]);
      component
        .find(Select)
        .simulate('change', [fixedOption, removableOption], {
          action: 'select-option',
        });

      component.update();

      expect(component.find(Select).prop('value')).toEqual([
        fixedOption,
        removableOption,
      ]);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(
        [fixedUser, users[1]],
        'select-option',
      );

      onChange.mockClear();

      expect(component.find(Select).prop('value')).toEqual([
        fixedOption,
        removableOption,
      ]);

      component.find(Select).simulate('change', [removableOption], {
        action: 'pop-value',
        removedValue: fixedOption,
      });

      component.update();

      expect(onChange).not.toHaveBeenCalled();

      expect(component.find(Select).prop('value')).toEqual([
        fixedOption,
        removableOption,
      ]);
    });
  });

  describe('inputValue', () => {
    it('should set inputValue to empty string by default', () => {
      const component = shallowUserPicker({ value: users[0] });
      expect(component.find(Select).prop('inputValue')).toEqual('');
    });

    it('onInputChange: should set inputValue to query', () => {
      const component = shallowUserPicker();
      const select = component.find(Select);
      select.simulate('inputChange', 'some text', { action: 'input-change' });
      expect(component.find(Select).prop('inputValue')).toEqual('some text');
    });

    it('onBlur: should clear inputValue', () => {
      const component = shallowUserPicker();
      const select = component.find(Select);
      select.simulate('blur');
      expect(component.find(Select).prop('inputValue')).toEqual('');
    });

    it('onChange: should clear inputValue', () => {
      const component = shallowUserPicker();
      const select = component.find(Select);
      select.simulate('change', userOptions[0], { action: 'select-option' });
      expect(component.find(Select).prop('inputValue')).toEqual('');
    });

    it('onFocus with value: should set inputValue to value', () => {
      const component = shallowUserPicker({ value: users[0] });
      const select = component.find(Select);
      select.simulate('focus', { target: {} });
      expect(component.find(Select).prop('inputValue')).toEqual(users[0].name);
    });

    it('onFocus no value: should have set empty inputValue', () => {
      const component = shallowUserPicker();
      const select = component.find(Select);
      select.simulate('focus', { target: {} });
      expect(component.find(Select).prop('inputValue')).toEqual('');
    });

    it('should highlight input value on focus', () => {
      const component = shallowUserPicker({ value: users[0] });
      const select = component.find(Select);
      const highlightInput = jest.fn();
      const input = document.createElement('input') as HTMLInputElement;
      input.select = highlightInput;
      select.simulate('focus', { target: input });
      expect(highlightInput).toBeCalledTimes(1);
    });
  });

  it('should blur on escape', () => {
    const component = shallowUserPicker();
    component.setState({ menuIsOpen: true });
    const ref = { blur: jest.fn() };
    (component.instance() as any).handleSelectRef(ref);

    component.find(Select).simulate('keyDown', { keyCode: 27 });
    expect(ref.blur).toHaveBeenCalled();
  });
});
