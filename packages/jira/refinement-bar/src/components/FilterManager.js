// @flow
/** @jsx jsx */

import { PureComponent } from 'react';
import { jsx } from '@emotion/core';
import { colors } from '@atlaskit/theme';

import { BaseSelect, selectComponents } from './Select';

const CLEAR_DATA = {
  value: '__remove-all',
  label: 'Remove all filters',
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

export class FilterManager extends PureComponent<*> {
  filterOptionFn: Object => boolean;

  options: Array<Object>;

  components = { ...selectComponents, Option };

  constructor(props: *) {
    super(props);

    const { options, value } = props;

    // set options here ONCE when the dialog opens, so they don't jostle about
    // as users select/deselect values
    this.options = getOptions(value, options);
    this.filterOptionFn = filterOptions(value);
  }

  handleChange = (value: *, meta: Object) => {
    const { onChange } = this.props;

    if (value && Array.isArray(value) && value.includes(CLEAR_DATA)) {
      onChange(this.props.value, { action: 'clear-options' });
    } else {
      onChange(value, meta);
    }
  };

  render() {
    const { onChange, storedValue, ...props } = this.props;

    return (
      <BaseSelect
        components={this.components}
        filterOption={this.filterOptionFn}
        onChange={this.handleChange}
        {...props}
        options={this.options}
        closeMenuOnSelect
      />
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
