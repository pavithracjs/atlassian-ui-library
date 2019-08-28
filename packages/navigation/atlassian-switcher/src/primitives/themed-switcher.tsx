import * as React from 'react';
import Switcher, { SwitcherProps } from '../components/switcher';
import {
  TopLevelItemWrapperTheme,
  ItemTheme,
  ChildItemTheme,
} from '../theme/default-theme';
import { CustomThemeResult, Appearance } from '../theme/types';

type ThemedSwitcherProps = {
  theme: CustomThemeResult;
  appearance: Appearance;
} & SwitcherProps;

export default ({
  theme,
  appearance = 'drawer',
  ...rest
}: ThemedSwitcherProps) => {
  return (
    <TopLevelItemWrapperTheme.Provider value={theme.topLevelItemWrapperTheme}>
      <ItemTheme.Provider value={theme.itemTheme}>
        <ChildItemTheme.Provider value={theme.childItemTheme}>
          <Switcher {...rest} appearance={appearance} />
        </ChildItemTheme.Provider>
      </ItemTheme.Provider>
    </TopLevelItemWrapperTheme.Provider>
  );
};
