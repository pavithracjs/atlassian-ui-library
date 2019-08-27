import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { itemThemeNamespace } from '@atlaskit/item';
import Item, { SwitcherItemProps } from './item';
import { ItemTheme } from '../theme/default-theme';
import { Themeable, ThemeTokens, CustomizableTokens } from '../theme/types';
import styled from 'styled-components';
import get from 'lodash/get';
import Color from 'color';

interface ToggleProps {
  isParentHovered?: boolean;
  tokens?: ThemeTokens;
  children: React.ReactNode;
}

const getBackgroundColor = (
  tokens: CustomizableTokens,
  change: number,
): string => {
  return Color(get(tokens, 'background'))
    .lighten(change)
    .hex();
};

const ThemeableItemParent = styled.div<ToggleProps>`
  ${({ isParentHovered, tokens }) =>
    isParentHovered &&
    `background-color: ${getBackgroundColor(tokens!.hover!, 0.02)}`};
  border-radius: 3px;
  flex-grow: 1;
  overflow: hidden;
`;

const ThemeableItemWrapper = styled(ThemeableItemParent)<ToggleProps>`
  width: 100%;
`;

const ThemeableToggleStyle = styled(ThemeableItemParent)<ToggleProps>`
  max-height: 47px;
  cursor: pointer;
  margin-left: 2px;
`;

export default (props: Themeable<SwitcherItemProps>) => (
  <ItemTheme.Consumer>
    {tokens => (
      <ThemeProvider theme={{ [itemThemeNamespace]: tokens }}>
        <Item {...props} />
      </ThemeProvider>
    )}
  </ItemTheme.Consumer>
);

export const ItemWrapper = (props: ToggleProps) => (
  <ItemTheme.Consumer>
    {tokens => <ThemeableItemWrapper {...props} tokens={tokens} />}
  </ItemTheme.Consumer>
);

export const Toggle = (props: ToggleProps) => (
  <ItemTheme.Consumer>
    {tokens => <ThemeableToggleStyle {...props} tokens={tokens} />}
  </ItemTheme.Consumer>
);
