import * as React from 'react';
import Switcher, { SwitcherProps } from '../components/switcher';
import { ItemTheme, ChildItemTheme, Themeable } from '../theme';

export default ({ theme = {}, ...rest }: Themeable<SwitcherProps>) => {
  return (
    <ItemTheme.Provider value={theme.itemTheme}>
      <ChildItemTheme.Provider value={theme.childItemTheme}>
        <Switcher {...rest} />
      </ChildItemTheme.Provider>
    </ItemTheme.Provider>
  );
};
