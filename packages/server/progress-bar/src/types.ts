import { ThemeProp } from '@atlaskit/theme';

export type ThemeProps = {
  value: string | number;
};

export type ThemeTokens = {
  container: any;
  bar: any;
  determinateBar: any;
  increasingBar: any;
  decreasingBar: any;
};

export interface CustomProgressBarProps {
  value: number;
  indeterminate: boolean;
}

export interface ProgressBarProps extends CustomProgressBarProps {
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
}
