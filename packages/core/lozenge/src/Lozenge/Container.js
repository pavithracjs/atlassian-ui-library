// @flow
/** @jsx jsx */
import { type Node } from 'react';
import { jsx } from '@emotion/core';
import { borderRadius } from '@atlaskit/theme';
import { type ThemeTokens } from '../theme';

const BORDER_RADIUS = `${borderRadius()}px`;

type ThemeTokensWithChildren = ThemeTokens & {
  children?: Node,
};

export default ({
  backgroundColor,
  textColor,
  children,
}: ThemeTokensWithChildren) => (
  <span
    css={{
      backgroundColor,
      borderRadius: BORDER_RADIUS,
      boxSizing: 'border-box',
      color: textColor,
      display: 'inline-block',
      fontSize: '11px',
      fontWeight: 700,
      lineHeight: 1,
      maxWidth: '100%',
      padding: '2px 0 3px 0',
      textTransform: 'uppercase',
      verticalAlign: 'baseline',
    }}
  >
    {children}
  </span>
);
