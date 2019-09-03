/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/core';
import { ThemeTokens } from '../types';

export interface LabelProps extends React.HTMLProps<HTMLInputElement> {
  attributesFn: (props: Record<string, any>) => Record<string, any>;
  cssFn: (props: LabelCSSProps) => CSSObject;
  isDisabled?: boolean;
  tokens: ThemeTokens;
}

export type LabelCSSProps = Pick<LabelProps, 'isDisabled' | 'tokens'>;

export const labelCSS = ({ isDisabled, tokens }: LabelCSSProps): CSSObject => ({
  alignItems: 'flex-start;',
  display: 'flex',
  color: isDisabled
    ? tokens.label.textColor.disabled
    : tokens.label.textColor.rest,
  ...(isDisabled && { cursor: 'not-allowed' }),
});

export default function({
  children,
  attributesFn,
  isDisabled,
  tokens,
  cssFn,
}: LabelProps) {
  return (
    <label {...attributesFn({})} css={cssFn({ isDisabled, tokens })}>
      {children}
    </label>
  );
}
