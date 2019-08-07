import React from 'react';
import { InputProps } from '../types';

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
    css={theme.container}
    onMouseDown={onMouseDown}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {elemBeforeInput}
    <input
      ref={forwardedRef}
      disabled={isDisabled}
      readOnly={isReadOnly}
      required={isRequired}
      css={theme.input}
      {...rest}
    />
    {elemAfterInput}
  </div>
);
