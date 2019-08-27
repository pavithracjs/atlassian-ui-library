import React, { MutableRefObject } from 'react';
import { mount } from 'enzyme';
import CheckboxIcon from '@atlaskit/icon/glyph/checkbox';
import CheckboxIndeterminateIcon from '@atlaskit/icon/glyph/checkbox-indeterminate';
import Checkbox, { CheckboxWithoutAnalytics } from '../../Checkbox';
import { name } from '../../version.json';

declare var global: any;

describe(name, () => {
  const mountCheckbox = (overridingProps: any) =>
    mount(
      <CheckboxWithoutAnalytics
        label=""
        onChange={() => {}}
        name="stub"
        value="stub value"
        {...overridingProps}
      />,
    );
  describe('console errors', () => {
    beforeEach(async () => {
      jest.spyOn(global.console, 'error');
    });

    afterEach(() => {
      // @ts-ignore - Property 'mockRestore' does not exist
      global.console.error.mockRestore();
    });
    it('should not log console error on mount', () => {
      mountCheckbox({});
      expect(global.console.error).not.toHaveBeenCalled();
    });
  });
  describe('<Checkbox />', () => {
    describe('<Checkbox /> stateless: should not use state isChecked property when passing it as props', () => {
      it('keeps isChecked as false when passing it as prop and calling onChange', () => {
        const cb = mountCheckbox({ isChecked: false, onChange: null });
        cb.find('input').simulate('change', { target: { checked: true } });
        expect(cb.find('input').prop('checked')).toBe(false);
      });

      it('keeps isChecked as true when passing it as prop and calling onChange', () => {
        const cb = mountCheckbox({ isChecked: true, onChange: null });
        cb.find('input').simulate('change', { target: { checked: false } });
        expect(cb.find('input').prop('checked')).toBe(true);
      });
    });
    it('should be unchecked by default', () => {
      const cb = mountCheckbox({ defaultChecked: false });
      expect(cb.find('input[checked]').length === 1).toBe(true);
    });
    it('should call onchange on change', () => {
      const myMock = jest.fn();
      const cb = mountCheckbox({ isChecked: false, onChange: myMock });
      cb.find('input').simulate('change', { target: { checked: true } });
      expect(cb.find('Checkbox').prop('isChecked')).toBe(false);
      expect(myMock.mock.calls.length).toBe(1);
    });
    it('should call onchange once', () => {
      const spy = jest.fn();
      const cb = mountCheckbox({ onChange: spy });
      cb.find('input').simulate('change');
      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should show indeterminate icon when indeterminate', () => {
      const cb = mountCheckbox({ isIndeterminate: true, isChecked: false });
      expect(cb.find(CheckboxIcon)).toHaveLength(0);
      expect(cb.find(CheckboxIndeterminateIcon)).toHaveLength(1);
    });
    it('should initially set the indeterminate state on the hidden checkbox', () => {
      let ref: MutableRefObject<HTMLInputElement>;
      const refFn = (el: MutableRefObject<HTMLInputElement>) => {
        ref = el;
      };
      const cb = mountCheckbox({
        inputRef: refFn,
        isIndeterminate: true,
        isChecked: false,
      });
      cb.update();
      // @ts-ignore - Property 'indeterminate' does not exist on HTMLInputElement
      expect(ref.indeterminate).toBe(true);
    });
    it('should set the indeterminate state on the hidden checkbox on update', () => {
      let ref: MutableRefObject<HTMLInputElement>;
      const refFn = (el: MutableRefObject<HTMLInputElement>) => {
        ref = el;
      };
      const cb = mountCheckbox({
        inputRef: refFn,
        isChecked: false,
        isIndeterminate: false,
      });

      cb.update();
      // @ts-ignore - Property 'indeterminate' does not exist on HTMLInputElement
      expect(ref.indeterminate).toBe(false);

      cb.setProps({ isIndeterminate: true });
      cb.update();
      // @ts-ignore - Property 'indeterminate' does not exist on HTMLInputElement
      expect(ref.indeterminate).toBe(true);
    });
    it('should pass all the extra props passed down to hidden checkbox', () => {
      const cb = mountCheckbox({
        'data-foo': 'checkbox-bar',
      });
      expect(cb.find('input').prop('data-foo')).toBe('checkbox-bar');
    });
  });
  describe('<Checkbox defaultChecked/>', () => {
    it('should render defaultChecked', () => {
      let ref: MutableRefObject<HTMLInputElement>;
      const refFn = (el: MutableRefObject<HTMLInputElement>) => {
        ref = el;
      };
      const cb = mountCheckbox({ inputRef: refFn, defaultChecked: true });
      cb.update();
      // @ts-ignore - Property 'indeterminate' does not exist on HTMLInputElement
      expect(ref.checked).toBe(true);
    });
    it('should render defaultChecked={undefined}', () => {
      let ref: MutableRefObject<HTMLInputElement>;
      const refFn = (el: MutableRefObject<HTMLInputElement>) => {
        ref = el;
      };
      const cb = mountCheckbox({ inputRef: refFn });
      cb.update();
      // @ts-ignore - Property 'indeterminate' does not exist on HTMLInputElement
      expect(ref.checked).toBe(false);
    });
  });
});

describe('CheckboxWithAnalytics', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'warn');
    jest.spyOn(global.console, 'error');
  });
  afterEach(() => {
    global.console.warn.mockRestore();
    global.console.error.mockRestore();
  });

  it('should mount without errors', () => {
    mount(
      <Checkbox
        label=""
        isChecked
        onChange={() => {}}
        name="stub"
        value="stub value"
      />,
    );
    /* eslint-disable no-console */
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    /* eslint-enable no-console */
  });
});
