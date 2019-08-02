import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import Item, { itemThemeNamespace } from '@atlaskit/item';
import { colors, gridSize } from '@atlaskit/theme';
import { FadeIn } from './fade-in';
import { createIcon } from '../utils/icon-themes';

const itemTheme = {
  padding: {
    default: {
      bottom: gridSize(),
      left: gridSize(),
      top: gridSize(),
      right: gridSize(),
    },
  },
  hover: {
    background: colors.N20A,
  },
  default: {
    background: 'transparent',
    text: colors.text,
    secondaryText: colors.N200,
  },
};

const itemThemeWithParentHovered = {
  ...itemTheme,
  hover: {
    background: colors.N30A,
  },
  default: {
    ...itemTheme.default,
    background: colors.N20A,
  },
};

const childItemTheme = {
  ...itemTheme,
  padding: {
    default: {
      ...itemTheme.padding.default,
      bottom: gridSize() / 2,
      top: gridSize() / 2,
    },
  },
  default: {
    ...itemTheme.default,
    text: colors.N700,
  },
};

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  border-radius: 3px;

  &&& {
    > * {
      flex-grow: 1;
    }
  }
`;

const ChildItemsContainer = styled.div`
  margin: 2px 0;
  border-radius: 3px;
  background-color: ${colors.N20A};
`;

const Toggle = styled.div<ToggleProps>`
  flex-shrink: 0;

  margin-left: 2px;
  padding: 7px 7px 8px 8px;
  border-radius: 3px;
  ${({ isParentHovered }) =>
    isParentHovered ? `background-color: ${colors.N20A}` : ''};

  &&& {
    flex-grow: 0;
  }

  &:hover {
    background-color: ${colors.N30A};
  }
`;

interface ToggleProps {
  isParentHovered?: boolean;
}

export interface SwitcherChildItem {
  href: string;
  label: string;
}

type SwitcherItemWithDropdownProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
  description?: React.ReactNode;
  onClick?: Function;
  href?: string;
  isDisabled?: boolean;
  childIcon?: React.ReactNode;
  childItems?: SwitcherChildItem[];
};

interface SwitcherItemState {
  itemHovered: boolean;
  showChildItems: boolean;
}

export default class SwitcherItemWithDropDown extends React.Component<
  SwitcherItemWithDropdownProps,
  SwitcherItemState
> {
  constructor(props: SwitcherItemWithDropdownProps) {
    super(props);
    this.state = {
      itemHovered: false,
      showChildItems: false,
    };
  }

  toggleChildItemsVisibility(event: React.SyntheticEvent) {
    event.preventDefault();
    this.setState({
      ...this.state,
      showChildItems: !this.state.showChildItems,
    });
  }

  toggleItemHovered(value: boolean) {
    this.setState({
      ...this.state,
      itemHovered: value,
    });
  }

  getToggle(showChildItems: boolean, isParentHovered: boolean) {
    const Icon = createIcon(showChildItems ? ChevronUpIcon : ChevronDownIcon, {
      size: 'medium',
    });

    return (
      <Toggle
        onClick={e => this.toggleChildItemsVisibility(e)}
        isParentHovered={isParentHovered}
      >
        <Icon theme="subtle" />
      </Toggle>
    );
  }

  render() {
    const { icon, description, childItems, childIcon, ...rest } = this.props;
    const { showChildItems, itemHovered } = this.state;
    const childItemsExist = childItems && childItems.length > 0;

    return (
      <FadeIn>
        <React.Fragment>
          <ItemContainer
            onMouseEnter={() => this.toggleItemHovered(true)}
            onMouseLeave={() => this.toggleItemHovered(false)}
          >
            <ThemeProvider
              theme={{
                [itemThemeNamespace]: itemHovered
                  ? itemThemeWithParentHovered
                  : itemTheme,
              }}
            >
              <Item elemBefore={icon} description={description} {...rest} />
            </ThemeProvider>
            {childItemsExist && this.getToggle(showChildItems, itemHovered)}
          </ItemContainer>
          {showChildItems && childItems && (
            <ChildItemsContainer>
              {childItems.map(item => (
                <ThemeProvider theme={{ [itemThemeNamespace]: childItemTheme }}>
                  <Item
                    elemBefore={childIcon}
                    href={item.href}
                    key={item.label}
                  >
                    {item.label}
                  </Item>
                </ThemeProvider>
              ))}
            </ChildItemsContainer>
          )}
        </React.Fragment>
      </FadeIn>
    );
  }
}
