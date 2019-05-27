import { DEFAULT_THEME_MODE } from '../constants';
import { Theme, ThemeProps } from '../types';

type CustomTheme = { theme: Theme };
type GetThemeFuncParams = ThemeProps | CustomTheme;

export default function getTheme(props?: GetThemeFuncParams): Theme {
  if (props) {
    if (props.theme.hasOwnProperty('__ATLASKIT_THEME__')) {
      return (props as ThemeProps).theme.__ATLASKIT_THEME__;
    }
    if (props.theme.hasOwnProperty('mode')) {
      return (props as CustomTheme).theme;
    }
  }
  return { mode: DEFAULT_THEME_MODE };
}
