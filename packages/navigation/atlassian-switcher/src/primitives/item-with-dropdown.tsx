import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import Item, { itemThemeNamespace } from '@atlaskit/item';
import { colors, gridSize } from '@atlaskit/theme';
import { FadeIn } from './fade-in';
import { SwitcherChildItem } from '../types';
import {
  createAndFireNavigationEvent,
  withAnalyticsEvents,
  UI_EVENT_TYPE,
  SWITCHER_CHILD_ITEM_SUBJECT,
  SWITCHER_ITEM_SUBJECT,
  SWITCHER_ITEM_EXPAND_SUBJECT,
} from '../utils/analytics';
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

type Props = {
  children: React.ReactNode;
  icon: React.ReactNode;
  description?: React.ReactNode;
  onChildItemClick?: Function;
  onExpandClick?: Function;
  onItemClick?: Function;
  href?: string;
  isDisabled?: boolean;
  childIcon?: React.ReactNode;
  childItems?: SwitcherChildItem[];
};

interface State {
  itemHovered: boolean;
  showChildItems: boolean;
}

class SwitcherItemWithDropDown extends React.Component<Props, State> {
  state = {
    itemHovered: false,
    showChildItems: false,
  };

  render() {
    const {
      icon,
      description,
      childItems,
      childIcon,
      onItemClick,
      onChildItemClick,
      ...rest
    } = this.props;
    const { showChildItems, itemHovered } = this.state;
    const childItemsExist = childItems && childItems.length > 0;

    return (
      <FadeIn>
        <React.Fragment>
          <ItemContainer
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            <ThemeProvider
              theme={{
                [itemThemeNamespace]: itemHovered
                  ? itemThemeWithParentHovered
                  : itemTheme,
              }}
            >
              <Item
                elemBefore={icon}
                description={description}
                onClick={onItemClick}
                {...rest}
              />
            </ThemeProvider>
            {childItemsExist && this.getToggle(showChildItems, itemHovered)}
          </ItemContainer>
          {showChildItems && childItems && (
            <ThemeProvider theme={{ [itemThemeNamespace]: childItemTheme }}>
              <ChildItemsContainer>
                {childItems.map(item => (
                  <Item
                    elemBefore={childIcon}
                    href={item.href}
                    key={item.label}
                    onClick={onChildItemClick}
                    data-test-id="switcher-child-item"
                  >
                    {item.label}
                  </Item>
                ))}
              </ChildItemsContainer>
            </ThemeProvider>
          )}
        </React.Fragment>
      </FadeIn>
    );
  }

  private toggleChildItemsVisibility(event: React.SyntheticEvent) {
    event.preventDefault();
    this.setState({
      showChildItems: !this.state.showChildItems,
    });

    if (!this.state.showChildItems) {
      this.props.onExpandClick && this.props.onExpandClick();
    }
  }

  private getToggle(showChildItems: boolean, isParentHovered: boolean) {
    const Icon = createIcon(showChildItems ? ChevronUpIcon : ChevronDownIcon, {
      size: 'medium',
    });

    return (
      <Toggle
        onClick={e => this.toggleChildItemsVisibility(e)}
        isParentHovered={isParentHovered}
        data-test-id="switcher-expand-toggle"
      >
        <Icon theme="subtle" />
      </Toggle>
    );
  }

  private toggleItemHovered(value: boolean) {
    this.setState({
      itemHovered: value,
    });
  }

  private onMouseEnter = () => this.toggleItemHovered(true);
  private onMouseLeave = () => this.toggleItemHovered(false);
}

const SwitcherItemWithDropDownWithEvents = withAnalyticsEvents<Props>({
  onChildItemClick: createAndFireNavigationEvent({
    eventType: UI_EVENT_TYPE,
    action: 'clicked',
    actionSubject: SWITCHER_CHILD_ITEM_SUBJECT,
  }),
  onExpandClick: createAndFireNavigationEvent({
    eventType: UI_EVENT_TYPE,
    action: 'clicked',
    actionSubject: SWITCHER_ITEM_EXPAND_SUBJECT,
  }),
  onItemClick: createAndFireNavigationEvent({
    eventType: UI_EVENT_TYPE,
    action: 'clicked',
    actionSubject: SWITCHER_ITEM_SUBJECT,
  }),
})(SwitcherItemWithDropDown);

export default SwitcherItemWithDropDownWithEvents;
