/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ThemeTokens } from '../types';

export interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
  isDisabled?: boolean;
  tokens: ThemeTokens;
}

export default ({ isDisabled, tokens, ...rest }: LabelProps) => (
  <label
    css={{
      alignItems: 'flex-start;',
      display: 'flex',
      color: isDisabled
        ? tokens.label.textColor.disabled
        : tokens.label.textColor.rest,
      ...(isDisabled && { cursor: 'not-allowed' }),
    }}
    {...rest}
  />
);
