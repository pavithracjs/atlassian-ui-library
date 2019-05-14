import { DEFAULT_THEME_MODE } from '../constants';
import { Theme, ThemeProps } from '../types';

type CustomTheme = { theme: Theme };
type GetThemeFuncParams = ThemeProps | CustomTheme | undefined;

function isThemeProps(props: GetThemeFuncParams): props is ThemeProps {
  return (props as ThemeProps).theme.__ATLASKIT_THEME__ !== undefined;
}

function isTheme(props: GetThemeFuncParams): props is CustomTheme {
  return (props as CustomTheme).theme !== undefined;
}

export default function getTheme(props: GetThemeFuncParams): Theme {
  if (isThemeProps(props)) {
    return props.theme.__ATLASKIT_THEME__;
  }
  if (isTheme(props)) {
    return props.theme;
  }
  return { mode: DEFAULT_THEME_MODE };
}
