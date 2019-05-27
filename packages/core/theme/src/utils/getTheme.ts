import { DEFAULT_THEME_MODE } from '../constants';
import { Theme, ThemeProps } from '../types';

type CustomTheme = { theme: Theme };
type GetThemeFuncParams = ThemeProps | CustomTheme;

export default function getTheme(props?: GetThemeFuncParams): Theme {
  if (
    props &&
    props.theme &&
    props.theme.hasOwnProperty('__ATLASKIT_THEME__')
  ) {
    return (props as ThemeProps).theme.__ATLASKIT_THEME__;
  }

  if (props && props.theme) {
    return (props as CustomTheme).theme;
  }

  return { mode: DEFAULT_THEME_MODE };
}
