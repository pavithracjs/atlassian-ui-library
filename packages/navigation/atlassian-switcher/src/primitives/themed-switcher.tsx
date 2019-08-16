import * as React from 'react';
import Switcher, { SwitcherProps } from '../components/switcher';
import { ItemTheme, ChildItemTheme } from '../theme/default-theme';
import { Themeable } from '../theme/types';

export default ({ theme = {}, ...rest }: Themeable<SwitcherProps>) => {
  return (
    <ItemTheme.Provider value={theme.itemTheme}>
      <ChildItemTheme.Provider value={theme.childItemTheme}>
        <Switcher {...rest} />
      </ChildItemTheme.Provider>
    </ItemTheme.Provider>
  );
};
