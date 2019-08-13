/** @jsx jsx */
import React from 'react';
import { jsx, CSSObject } from '@emotion/core';
import { Overrides } from '../types';
import { ThemeTokens } from '../theme';

interface Props {
  isDisabled: boolean;
  isReadOnly: boolean;
  isRequired: boolean;
  name?: string | undefined;
  placeholder: string | undefined;
  defaultValue: string | string[] | undefined;
  value: string | number | undefined;
  type: string | undefined;
  overrides: Overrides | undefined;

  // Theme controls a number of visual stylings
  theme: ThemeTokens;

  // user provided (others can be provided through overrides)
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> | undefined;

  // needed by TextField
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  onMouseDown: React.MouseEventHandler<HTMLElement>;
  onMouseEnter: React.MouseEventHandler<HTMLElement>;
  onMouseLeave: React.MouseEventHandler<HTMLElement>;

  /** Element after the input field */
  elemAfterInput?: React.ReactNode;
  /** Element before the input field */
  elemBeforeInput?: React.ReactNode;

  /* returns the ref of the input */
  innerRef: (ref: HTMLInputElement | null) => void;
}

type Result = {
  container: React.HTMLAttributes<HTMLElement>;
  input: React.InputHTMLAttributes<HTMLInputElement>;
};

function withOverrides(
  overrides: Overrides | undefined,
  input: React.InputHTMLAttributes<HTMLInputElement>,
  container: React.HTMLAttributes<HTMLElement>,
): Result {
  const result = { input, container };

  if (!overrides) {
    return result;
  }

  if (overrides.Input && overrides.Input.attributes) {
    result.input = overrides.Input.attributes(input);
  }

  if (overrides.Container && overrides.Container.attributes) {
    result.container = overrides.Container.attributes(container);
  }

  return result;
}

export default function Input({
  elemAfterInput,
  elemBeforeInput,
  isDisabled,
  isReadOnly,
  isRequired,
  onChange,
  onKeyDown,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onBlur,
  onFocus,
  name,
  value,
  defaultValue,
  placeholder,
  type,
  theme,
  innerRef,
  overrides,
}: Props) {
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
    type,
    placeholder,
    onChange,
    onKeyDown,
    onBlur,
    onFocus,
    name,
    value,
    defaultValue,
  };
  const containerProps: React.HTMLAttributes<HTMLElement> = {
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
  };

  const props = withOverrides(overrides, inputProps, containerProps);

  return (
    <div css={theme.container as CSSObject} {...props.container}>
      {elemBeforeInput}
      <input css={theme.input as CSSObject} ref={innerRef} {...props.input} />
      {elemAfterInput}
    </div>
  );
}
