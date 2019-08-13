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

  // Needed by TextField
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
  const ourInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    onFocus,
    onBlur,
    disabled: isDisabled,
    readOnly: isReadOnly,
    required: isRequired,
  };

  // check for any clashes when in development
  if (process.env.NODE_ENV !== 'production') {
    const ours: string[] = Object.keys(ourInputProps);
    const supplied: string[] = Object.keys(otherProps);

    ours.forEach((key: string) => {
      if (supplied.includes(key)) {
        console.warn(`
          FieldText:
          You are attempting to add prop "${key}" to the input field.
          It is clashing with one of our supplied props.
          Please try to control this prop through our public API
        `);
      }
    });
  }

  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    ...otherProps,
    // overriding any clashes
    ...ourInputProps,
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
