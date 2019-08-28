import * as React from 'react';
import Switcher, { SwitcherProps } from '../components/switcher';
import {
  TopLevelItemWrapperTheme,
  ItemTheme,
  ChildItemTheme,
} from '../theme/default-theme';
import { Themeable } from '../theme/types';

export default ({
  theme = {},
  appearance = 'drawer',
  ...rest
}: Themeable<SwitcherProps>) => {
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
