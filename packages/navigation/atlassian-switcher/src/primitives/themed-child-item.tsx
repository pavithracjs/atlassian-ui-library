import * as React from 'react';
import Item, { SwitcherItemProps } from './item';
import { itemThemeNamespace } from '@atlaskit/item';
import { ChildItemTheme, Themeable } from '../theme';
import { ThemeProvider } from 'styled-components';

export default (props: Themeable<SwitcherItemProps>) => (
  <ChildItemTheme.Provider>
    <ChildItemTheme.Consumer>
      {tokens => (
        <ThemeProvider theme={{ [itemThemeNamespace]: tokens }}>
          <Item {...props} />
        </ThemeProvider>
      )}
    </ChildItemTheme.Consumer>
  </ChildItemTheme.Provider>
);
