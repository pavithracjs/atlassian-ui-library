import * as React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import Item, { itemThemeNamespace } from '@atlaskit/item';
import { colors, gridSize } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
import Avatar from './avatar';
import { FadeIn } from './fade-in';
import { SwitcherChildItem } from '../types';
import {
  createAndFireNavigationEvent,
  withAnalyticsEvents,
  UI_EVENT_TYPE,
  SWITCHER_CHILD_ITEM_SUBJECT,
  SWITCHER_ITEM_SUBJECT,
  SWITCHER_ITEM_EXPAND_SUBJECT,
  WithAnalyticsEventsProps,
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
    background: 'transparent',
  },
  default: {
    background: 'transparent',
    text: colors.text,
    secondaryText: colors.N200,
  },
  width: {
    default: '100%',
  },
};

const childItemTheme = {
  padding: {
    default: {
      ...itemTheme.padding.default,
      bottom: gridSize() / 2,
      top: gridSize() / 2,
    },
  },
  hover: {
    background: colors.N20A,
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
`;

const ItemWrapper = styled.div<ToggleProps>`
  display: flex;
  flex-grow: 1;
  border-radius: 3px;
  padding-top: 1px;

  width: 100%;
  overflow: hidden;

  ${({ isParentHovered }) =>
    isParentHovered ? `background-color: ${colors.N20A}` : ''};

  &:hover {
    background-color: ${colors.N30A};
  }
`;

const ChildItemsContainer = styled.div`
  margin: 2px 0;
  border-radius: 3px;
  background-color: ${colors.N20A};
`;

const Toggle = styled.div<ToggleProps>`
  flex-shrink: 0;
  flex-grow: 0;

  cursor: pointer;
  margin-left: 2px;
  border-radius: 3px;

  ${({ isParentHovered }) =>
    isParentHovered ? `background-color: ${colors.N20A}` : ''};

  &:hover {
    background-color: ${colors.N30A};
  }
`;

interface ToggleProps {
  isParentHovered?: boolean;
}

interface Props extends WithAnalyticsEventsProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  tooltipContent: React.ReactNode;
  description?: React.ReactNode;
  onChildItemClick?: Function;
  onExpandClick?: Function;
  onItemClick?: Function;
  href?: string;
  isDisabled?: boolean;
  childIcon?: React.ReactNode;
  childItems?: SwitcherChildItem[];
}

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
            <ItemWrapper isParentHovered={itemHovered}>
              <ThemeProvider
                theme={{
                  [itemThemeNamespace]: itemTheme,
                }}
              >
                <Item
                  elemBefore={icon}
                  description={childItemsExist ? description : null}
                  onClick={onItemClick}
                  {...rest}
                />
              </ThemeProvider>
            </ItemWrapper>
            {childItemsExist && this.renderToggle(showChildItems, itemHovered)}
          </ItemContainer>
          {showChildItems && childItems && (
            <ThemeProvider theme={{ [itemThemeNamespace]: childItemTheme }}>
              <ChildItemsContainer>
                {childItems.map(item => (
                  <Item
                    elemBefore={
                      <Avatar
                        avatarUrl={item.avatar}
                        fallbackComponent={childIcon}
                      />
                    }
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

  private renderToggle(showChildItems: boolean, isParentHovered: boolean) {
    const Icon = createIcon(showChildItems ? ChevronUpIcon : ChevronDownIcon, {
      size: 'medium',
    });
    const toggle = (
      <Toggle isParentHovered={isParentHovered}>
        <ThemeProvider
          theme={{
            [itemThemeNamespace]: itemTheme,
          }}
        >
          <Item
            data-test-id="switcher-expand-toggle"
            onClick={this.toggleChildItemsVisibility}
            onKeyDown={(e: KeyboardEvent) =>
              e.key === 'Enter' && this.toggleChildItemsVisibility()
            }
          >
            <Icon theme="subtle" />
          </Item>
        </ThemeProvider>
      </Toggle>
    );

    return showChildItems ? (
      toggle
    ) : (
      <Tooltip
        content={this.props.tooltipContent}
        hideTooltipOnMouseDown
        position="top"
      >
        {toggle}
      </Tooltip>
    );
  }

  private toggleChildItemsVisibility = (event?: React.SyntheticEvent) => {
    event && event.preventDefault();
    this.setState({
      showChildItems: !this.state.showChildItems,
    });

    if (!this.state.showChildItems) {
      this.props.onExpandClick && this.props.onExpandClick();
    }
  };

  private setItemHovered = (value: boolean) => {
    this.setState({
      itemHovered: value,
    });
  };

  private onMouseEnter = () => this.setItemHovered(true);
  private onMouseLeave = () => this.setItemHovered(false);
}

const SwitcherItemWithDropDownWithEvents = withAnalyticsEvents({
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
