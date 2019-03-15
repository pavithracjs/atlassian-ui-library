// @flow

import React from 'react';
import { css } from 'emotion';
import type { InputProps } from '../types';

export default ({
  appearance,
  elemAfterInput,
  elemBeforeInput,
  forwardedRef,
  isCompact,
  isDisabled,
  isFocused,
  isHovered,
  isInvalid,
  isMonospaced,
  isReadOnly,
  isRequired,
  onBlur,
  onFocus,
  onMouseEnter,
  onMouseLeave,
  theme,
  ...rest
}: InputProps) => (
  <div
    className={css(theme.container)}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={onFocus}
    onBlur={onBlur}
  >
    {elemBeforeInput}
    <input
      ref={forwardedRef}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      className={css(theme.input)}
      {...rest}
    />
    {elemAfterInput}
  </div>
);
