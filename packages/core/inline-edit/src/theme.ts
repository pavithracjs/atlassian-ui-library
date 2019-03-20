import { createTheme, gridSize, fontSize } from '@atlaskit/theme';

const propsDefaults = {
  gridSize: gridSize(),
  fontSize: fontSize(),
  fontWeight: 'auto',
};

export interface ThemeProps {
  gridSize?: number;
  fontSize?: number;
  fontWeight?: string;
}

export interface ThemeTokens {
  gridSize: number;
  fontSize: number;
  fontWeight: string;
}

export default createTheme<ThemeTokens, ThemeProps>(props => ({
  ...propsDefaults,
  ...props,
}));
