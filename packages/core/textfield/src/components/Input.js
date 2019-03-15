// @flow

import React from 'react';
import { css } from 'emotion';
import type { InputProps } from '../types';

export default ({
  appearance,
  elemAfterInput,
  elemBeforeInput,
  focusInput,
  forwardedRef,
  isCompact,
  isDisabled,
  isFocused,
  isHovered,
  isInvalid,
  isMonospaced,
  isReadOnly,
  isRequired,
  onMouseEnter,
  onMouseLeave,
  theme,
  ...rest
}: InputProps) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions
  <div
    className={css(theme.container)}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    onClick={focusInput}
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
