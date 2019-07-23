/** @jsx jsx */
import { jsx, InterpolationWithTheme } from '@emotion/core';
import { ThemeTokens } from '../types';

export const labelTextCSS = ({
  tokens,
}: {
  tokens: ThemeTokens;
}): InterpolationWithTheme<any> => ({
  paddingTop: tokens.label.spacing.top,
  paddingRight: tokens.label.spacing.right,
  paddingBottom: tokens.label.spacing.bottom,
  paddingLeft: tokens.label.spacing.left,
});

export default ({
  tokens,
  getStyles,
  ...rest
}: {
  getStyles: (
    key: 'labelText',
    props: { tokens: ThemeTokens },
  ) => InterpolationWithTheme<any>;
  tokens: ThemeTokens;
  children: React.ReactNode;
}) => <span css={getStyles('labelText', { tokens })} {...rest} />;
