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
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
  theme,
  ...rest
}: InputProps) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div
    className={css(theme.container)}
    onMouseDown={onMouseDown}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {elemBeforeInput}
    <input
      className={css(theme.input)}
      ref={forwardedRef}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      {...rest}
    />
    {elemAfterInput}
  </div>
);
