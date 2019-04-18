// @flow
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { gridSize } from '@atlaskit/theme';
import { type ThemeTokens } from '../theme';

const HORIZONTAL_SPACING = `${gridSize() / 2}px`;

export default ({ maxWidth, children }: ThemeTokens) => (
  <span
    css={{
      display: 'inline-block',
      verticalAlign: 'top',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      padding: `0 ${HORIZONTAL_SPACING}`,
      maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
      width: '100%',
    }}
  >
    {children}
  </span>
);
