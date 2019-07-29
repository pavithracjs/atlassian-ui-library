// @flow
/** @jsx jsx */

import { PureComponent } from 'react';
import { jsx } from '@emotion/core';
import { colors } from '@atlaskit/theme';
import { BaseSelect, selectComponents } from '../../components/Select';
import { DialogInner } from '../../components/Popup';

// TODO: there's probably a better way to do this, but it's late, and i'm tired.
export const CLEAR_DATA = {
  value: '__clear-selected',
  label: 'Clear selected items',
};
// ==============================
// Styled Components
// ==============================

const ClearOption = ({ children, innerProps, isFocused }: *) => (
  <div
    css={{
      boxSizing: 'border-box',
      color: colors.primary(),
      cursor: 'pointer',
      fontSize: 'inherit',
      padding: '8px 12px',
      userSelect: 'none',
      textDecoration: isFocused ? 'underline' : null,
      webkitTapHighlightColor: 'rgba(0,0,0,0)',
      width: '100%',

      '&:hover': {
        textDecoration: 'underline',
      },
    }}
    {...innerProps}
  >
    {children}
  </div>
);

// NOTE: fork the option renderer based on a "clear marker", which needs to look
// and behave in a different way

const Option = (props: *) =>
  props.data === CLEAR_DATA ? (
    <ClearOption {...props} />
  ) : (
    <selectComponents.Option {...props} />
  );

const defaultComponents = { ...selectComponents, Option };

export default class SelectView extends PureComponent<*, *> {
  state = { components: {} };

  filterOptionFn: Object => boolean;

  options: Array<Object>;

  constructor(props: *) {
    super(props);

    const { field, refinementBarValue, storedValue } = props;

    // NOTE: support array or function that resolves to an array.
    let resolvedOptions = field.options;
    if (typeof field.options === 'function') {
      resolvedOptions = field.options(refinementBarValue);
    }

    // set options here ONCE when the dialog opens, so they don't jostle about
    // as users select/deselect values
    this.options = getOptions(storedValue, resolvedOptions);
    this.filterOptionFn = filterOptions(storedValue);
  }

  static getDerivedStateFromProps(p: *, s: *) {
    if (p.components !== s.components) {
      return { components: { ...defaultComponents, ...p.components } };
    }

    return null;
  }

  handleChange = (value: *) => {
    const { onChange } = this.props;

    if (value && Array.isArray(value) && value.includes(CLEAR_DATA)) {
      onChange([]);
    } else {
      onChange(value);
    }
  };

  render() {
    const { field, onChange, storedValue, ...props } = this.props;

    return (
      <DialogInner minWidth={220}>
        <BaseSelect
          components={this.state.components}
          filterOption={this.filterOptionFn}
          onChange={this.handleChange}
          onMenuScrollToBottom={field.onMenuScrollToBottom}
          onMenuScrollToTop={field.onMenuScrollToTop}
          options={this.options}
          placeholder={field.placeholder}
          {...props}
        />
      </DialogInner>
    );
  }
}

// ==============================
// Helper Utilities
// ==============================

const lcase = str => str.toLowerCase();
const trim = str => str.replace(/^\s+|\s+$/g, '');
const stringify = option => `${option.label} ${option.value}`;

// NOTE: determine which options should be visible to the user
// - reimplements react-select's input matching
// - checks (and hides) if the option already exists "above the fold"
const filterOptions = storedValue => (option, rawInput) => {
  const { data, value } = option;
  const notCurrentlySelected =
    !storedValue || !storedValue.some(o => o.value === value);

  if (rawInput) {
    const input = lcase(trim(rawInput));
    const candidate = lcase(trim(stringify(option)));
    const isMatch = candidate.includes(input);

    return isMatch && !data.aboveTheFold;
  }

  return notCurrentlySelected || data.aboveTheFold;
};

// NOTE: prepends the options array with all the currently selected options
// - selected options are marked with an `aboveTheFold` data key
// - also adds a special "clear" option
const getOptions = (current, resolved) => {
  if (!current || !current.length) return resolved;

  return current
    .map(o => ({ ...o, aboveTheFold: true }))
    .concat([CLEAR_DATA])
    .concat(resolved);
};
