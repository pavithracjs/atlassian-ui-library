/** @jsx jsx */
import { jsx, InterpolationWithTheme } from '@emotion/core';
import { ThemeTokens } from '../types';

export interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
  getStyles: (
    key: 'label',
    props: LabelCSSProps,
  ) => InterpolationWithTheme<any>;
  isDisabled?: boolean;
  tokens: ThemeTokens;
}

export type LabelCSSProps = Pick<LabelProps, 'isDisabled' | 'tokens'>;

export const labelCSS = ({ isDisabled, tokens }: LabelCSSProps) => ({
  alignItems: 'flex-start;',
  display: 'flex',
  color: isDisabled
    ? tokens.label.textColor.disabled
    : tokens.label.textColor.rest,
  ...(isDisabled && { cursor: 'not-allowed' }),
});

export default ({ isDisabled, tokens, getStyles, ...rest }: LabelProps) => (
  <label css={getStyles('label', { isDisabled, tokens, ...rest })} {...rest} />
);
