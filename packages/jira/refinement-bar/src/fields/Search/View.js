// @flow
/** @jsx jsx */

// $FlowFixMe "there is no `forwardRef` export in `react`"
import { createRef, forwardRef, PureComponent } from 'react';
import { jsx } from '@emotion/core';
import { borderRadius, colors, gridSize } from '@atlaskit/theme';
import SearchIcon from '@atlaskit/icon/glyph/search';

import { ClearButton, HiddenSubmitButton } from '../../components/common';

type State = {
  isFocused: boolean,
};

export default class SearchView extends PureComponent<*, State> {
  state = { isFocused: false };

  inputRef = createRef();

  handleChange = (event: Event) => {
    // $FlowFixMe "property `value` is missing in `EventTarget`"
    this.props.onChange(event.target.value);
  };

  handleClear = () => {
    this.props.onChange('');
    const el = this.inputRef.current;

    if (el && typeof el.focus === 'function') {
      el.focus();
    }
  };

  handleSubmit = (event: Event) => {
    event.preventDefault();
  };

  toggleFocus = (isFocused: boolean) => () => {
    this.setState({ isFocused });
  };

  render() {
    const { value } = this.props;
    const { isFocused } = this.state;
    const width = isFocused || (value && value.length) ? 160 : 80;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Input
          ref={this.inputRef}
          onChange={this.handleChange}
          onBlur={this.toggleFocus(false)}
          onFocus={this.toggleFocus(true)}
          value={value}
          style={{ width }}
        />

        {value ? (
          <ClearButton onClick={this.handleClear} label="Clear search" />
        ) : (
          <SearchIndicator />
        )}

        <HiddenSubmitButton tabIndex="-1" type="submit">
          Submit
        </HiddenSubmitButton>
      </Form>
    );
  }
}

// ==============================
// Styled Components
// ==============================

const Form = (props: *) => <form css={{ position: 'relative' }} {...props} />;
const SearchIndicator = (props: *) => (
  <div
    css={{
      background: 0,
      border: 0,
      borderRadius: borderRadius(),
      color: colors.N400,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      // cursor: 'pointer',
      height: '100%',
      padding: 0,
      width: 40,
      position: 'absolute',
      outline: 0,
      right: 0,
      transition: 'background-color 150ms',
      top: 0,
    }}
    {...props}
  >
    <SearchIcon label="Submit" />
  </div>
);

// eslint-disable-next-line react/no-multi-comp
const Input = forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      css={{
        background: 0,
        backgroundColor: colors.N20A,
        border: 0,
        borderRadius: borderRadius(),
        color: colors.N400,
        fontSize: 'inherit',
        lineHeight: 1.3,
        padding: `${gridSize()}px ${gridSize() * 1.5}px`,
        paddingRight: 40,
        outline: 0,
        transition:
          'background-color 150ms, width 200ms cubic-bezier(0.2, 0.0, 0.0, 1)',

        ':hover': {
          backgroundColor: colors.N30A,
        },
        ':focus, :active': {
          backgroundColor: colors.N40A,
        },
      }}
      {...props}
    />
  );
});
