import { createTheme, colors } from '@atlaskit/theme';
import memoize from 'memoize-one';
import { ComponentTokens, EvaluatedTokens } from './types';

export const componentTokens: ComponentTokens = {
  label: {
    textColor: {
      rest: { light: colors.N900, dark: colors.DN600 },
      disabled: { light: colors.N80, dark: colors.N80 },
    },
    spacing: {
      top: '2px',
      right: '4px',
      bottom: '2px',
      left: '4px',
    },
  },
  icon: {
    borderWidth: '2px',
    borderColor: {
      rest: { light: colors.N40, dark: colors.DN80 },
      disabled: { light: '', dark: '' },
      checked: { light: 'currentColor', dark: 'currentColor' },
      active: { light: 'currentColor', dark: 'currentColor' },
      invalid: { light: colors.R300, dark: colors.R300 },
      focused: { light: colors.B100, dark: colors.B75 },
      hovered: { light: colors.N40, dark: colors.DN200 },
    },
    boxColor: {
      rest: { light: colors.N10, dark: colors.DN10 },
      disabled: { light: colors.N20, dark: colors.DN10 },
      active: { light: colors.B50, dark: colors.B200 },
      hoveredAndChecked: { light: colors.B300, dark: colors.B75 },
      hovered: { light: colors.N30, dark: colors.DN30 },
      checked: { light: colors.B400, dark: colors.B400 },
    },
    tickColor: {
      rest: { light: 'transparent', dark: 'transparent' },
      disabledAndChecked: { light: colors.N70, dark: colors.DN90 },
      activeAndChecked: { light: colors.B400, dark: colors.DN10 },
      checked: { light: colors.N10, dark: colors.DN10 },
    },
    size: 'medium',
  },
};

const evaluateMode = function<T, R>(obj: T, mode: string): R {
  function traverse(obj: any) {
    return Object.keys(obj).reduce(
      (acc: any, curr: string) => {
        const value = obj[curr];
        if (typeof value !== 'object') {
          acc[curr] = value;
        } else if (Object.keys(value).includes(mode)) {
          acc[curr] = value[mode];
        } else {
          acc[curr] = traverse(obj[curr]);
        }
        return acc;
      },
      {} as R,
    );
  }
  return traverse(obj);
};

const defaultThemeFn = ({
  tokens,
  mode,
}: {
  tokens: ComponentTokens;
  mode: string;
}): EvaluatedTokens => {
  return evaluateMode<ComponentTokens, EvaluatedTokens>(tokens, mode);
};

export default createTheme<
  EvaluatedTokens,
  { tokens: ComponentTokens; mode: string }
>(defaultThemeFn);
