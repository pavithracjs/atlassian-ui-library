// @flow
/** @jsx jsx */

// $FlowFixMe "there is no `forwardRef` export in `react`"
import { createRef, forwardRef, PureComponent, type ElementRef } from 'react';
import { applyRefs } from 'apply-ref';
import { jsx } from '@emotion/core';
import { borderRadius, colors, gridSize } from '@atlaskit/theme';
import SearchIcon from '@atlaskit/icon/glyph/search';

import {
  ClearButton,
  HiddenButton,
  HiddenLabel,
} from '../../components/common';

type Props = {
  field: Object,
  onClear: () => void,
  onChange: string => void,
  innerRef: ElementRef<*>,
  value: string,
};
type State = {
  isFocused: boolean,
};

export default class SearchView extends PureComponent<Props, State> {
  state = { isFocused: false };

  inputRef = createRef();

  handleChange = (event: Event) => {
    // $FlowFixMe "property `value` is missing in `EventTarget`"
    this.props.onChange(event.target.value);
  };

  handleClear = () => {
    this.props.onClear();
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
    const { field, innerRef, value } = this.props;
    const { isFocused } = this.state;
    const width = isFocused || (value && value.length) ? 160 : 80;
    const id = `refinement-bar-${field.key}`;

    return (
      <Form onSubmit={this.handleSubmit}>
        <HiddenLabel htmlFor={id}>{field.label}</HiddenLabel>
        <Input
          id={id}
          ref={applyRefs(innerRef, this.inputRef)}
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

        <HiddenButton tabIndex="-1" type="submit">
          Submit
        </HiddenButton>
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
      alignItems: 'center',
      background: 0,
      border: 0,
      borderRadius: borderRadius(),
      color: colors.N400,
      display: 'flex',
      height: '100%',
      justifyContent: 'center',
      outline: 0,
      padding: 0,
      pointerEvents: 'none',
      position: 'absolute',
      right: 0,
      top: 0,
      transition: 'background-color 150ms',
      width: 40,
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
