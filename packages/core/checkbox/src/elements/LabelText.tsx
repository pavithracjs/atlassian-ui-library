/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ThemeTokens } from '../types';

export default ({
  tokens,
  ...rest
}: {
  tokens: ThemeTokens;
  children: React.ReactNode;
}) => (
  <span
    css={{
      paddingTop: tokens.label.spacing.top,
      paddingRight: tokens.label.spacing.right,
      paddingBottom: tokens.label.spacing.bottom,
      paddingLeft: tokens.label.spacing.left,
    }}
    {...rest}
  />
);
