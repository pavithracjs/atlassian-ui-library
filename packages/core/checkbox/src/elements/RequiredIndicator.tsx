/** @jsx jsx */
import { jsx } from '@emotion/core';
import { math, gridSize } from '@atlaskit/theme';

export interface RequiredIndicatorProps
  extends React.HTMLProps<HTMLSpanElement> {}

export default (props: RequiredIndicatorProps) => (
  <span
    css={{
      color: colors.R400,
      paddingLeft: `${math.multiply(gridSize, 0.25)}px;`,
    }}
    {...props}
  />
);
