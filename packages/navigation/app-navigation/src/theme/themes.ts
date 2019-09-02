import { B200, B500, DN10, N0, N20 } from '@atlaskit/theme/colors';
import { generateTheme } from './themeGenerator';
import { AppNavigationTheme } from './types';

export const darkTheme: AppNavigationTheme = generateTheme({
  primary: {
    backgroundColor: DN10,
    color: N20,
  },
  secondary: {
    backgroundColor: N20,
    color: DN10,
  },
});

export const lightTheme: AppNavigationTheme = generateTheme({
  primary: {
    backgroundColor: B500,
    color: N0,
  },
  secondary: {
    backgroundColor: B200,
    color: N0,
  },
});

export const defaultTheme: AppNavigationTheme = lightTheme;
