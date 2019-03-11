// @flow

import React from 'react';
import type { InputProps } from '../types';

export default ({
  appearance,
  forwardedRef,
  isCompact,
  isDisabled,
  isFocused,
  isHovered,
  isInvalid,
  isMonospaced,
  isReadOnly,
  isRequired,
  theme,
  ...rest
}: InputProps) => (
  <div css={theme.container}>
    <input
      ref={forwardedRef}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      css={theme.input}
      {...rest}
    />
  </div>
);
