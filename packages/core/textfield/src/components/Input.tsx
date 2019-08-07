/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';
import { InputProps } from '../types';

export default function Input({
  appearance,
  elemAfterInput,
  elemBeforeInput,
  innerRef,
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
}: InputProps) {
  return (
    <div
      css={theme.container as CSSObject}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {elemBeforeInput}
      <input
        ref={innerRef}
        disabled={isDisabled}
        readOnly={isReadOnly}
        required={isRequired}
        css={theme.input as CSSObject}
        {...rest}
      />
      {elemAfterInput}
    </div>
  );
}
