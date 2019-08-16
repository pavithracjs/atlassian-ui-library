import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { itemThemeNamespace } from '@atlaskit/item';
import Item, { SwitcherItemProps } from './item';
import { ChildItemTheme } from '../theme/default-theme';
import { Themeable } from '../theme/types';

export default (props: Themeable<SwitcherItemProps>) => (
  <ChildItemTheme.Consumer>
    {tokens => (
      <ThemeProvider theme={{ [itemThemeNamespace]: tokens }}>
        <Item {...props} />
      </ThemeProvider>
    )}
  </ChildItemTheme.Consumer>
);
