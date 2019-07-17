/** @jsx jsx */
import { jsx } from '@emotion/core';
import { math, gridSize } from '@atlaskit/theme';
import { ThemeTokens } from '../types';

export interface RequiredIndicatorProps
  extends React.HTMLProps<HTMLSpanElement> {
  tokens: ThemeTokens;
}

export default ({ tokens, ...props }: RequiredIndicatorProps) => (
  <span
    css={{
      color: tokens.requiredIndicator.textColor.rest,
      paddingLeft: `${math.multiply(gridSize, 0.25)}px;`,
    }}
    {...props}
  />
);
