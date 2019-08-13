/** @jsx jsx */
import React from 'react';
import { jsx, CSSObject } from '@emotion/core';
import { ThemeTokens } from '../theme';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  isDisabled: boolean;
  isReadOnly: boolean;
  isRequired: boolean;

  // Theme controls a number of visual stylings
  theme: ThemeTokens;

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

export default function Input({
  elemAfterInput,
  elemBeforeInput,
  isDisabled,
  isReadOnly,
  isRequired,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  onBlur,
  onFocus,
  theme,
  innerRef,
  ...otherProps
}: Props) {
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    // we are going to override any clashes
    ...otherProps,
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
  };
  const containerProps: React.HTMLAttributes<HTMLElement> = {
    onMouseDown,
    onMouseEnter,
    onMouseLeave,
  };
  return (
    <div {...containerProps} css={theme.container as CSSObject}>
      {elemBeforeInput}
      <input {...inputProps} css={theme.input as CSSObject} ref={innerRef} />
      {elemAfterInput}
    </div>
  );
}
