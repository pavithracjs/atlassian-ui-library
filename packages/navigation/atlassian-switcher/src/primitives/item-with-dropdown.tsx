import * as React from 'react';
import styled from 'styled-components';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronUpIcon from '@atlaskit/icon/glyph/chevron-up';
import { SwitcherThemedItem, SwitcherThemedChildItem } from './index';
import { colors } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';
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

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  box-sizing: border-box;
  border-radius: 3px;
`;

const ItemWrapper = styled.div<ToggleProps>`
  flex-grow: 1;
  border-radius: 3px;
  padding-top: 1px;
  width: 100%;
  overflow: hidden;

  // limit the width of the Item component to make sure long labels and descriptions are ellipsed properly
  // remove this once the Item allows width theming
  &&& > * {
    max-width: 100%;
  }
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
  flex-grow: 1;
  max-height: 47px;
  cursor: pointer;
  margin-left: 2px;

  ${({ isParentHovered }) =>
    isParentHovered ? `background-color: ${colors.N20A}` : ''};

  &:hover {
    background-color: ${colors.N30A};
  }
`;

interface ToggleProps {
  isParentHovered?: boolean;
}

interface Props {
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
              <SwitcherThemedItem
                icon={icon}
                description={childItemsExist ? description : null}
                onClick={onItemClick}
                {...rest}
              />
            </ItemWrapper>
            {childItemsExist && this.renderToggle(showChildItems, itemHovered)}
          </ItemContainer>
          {showChildItems && childItems && (
            <ChildItemsContainer>
              {childItems.map(item => (
                <SwitcherThemedChildItem
                  icon={childIcon}
                  href={item.href}
                  key={item.label}
                  onClick={onChildItemClick}
                  data-test-id="switcher-child-item"
                >
                  {item.label}
                </SwitcherThemedChildItem>
              ))}
            </ChildItemsContainer>
          )}
        </React.Fragment>
      </FadeIn>
    );
  }

  private renderToggle(showChildItems: boolean, isParentHovered: boolean) {
    const Icon = createIcon(showChildItems ? ChevronUpIcon : ChevronDownIcon, {
      size: 'medium',
    });

    return (
      <Tooltip
        content={!this.state.showChildItems && this.props.tooltipContent}
        position="top"
      >
        <Toggle isParentHovered={isParentHovered}>
          <SwitcherThemedItem
            data-test-id="switcher-expand-toggle"
            onClick={this.toggleChildItemsVisibility}
            onKeyDown={(e: KeyboardEvent) =>
              e.key === 'Enter' && this.toggleChildItemsVisibility()
            }
          >
            <Icon theme="subtle" />
          </SwitcherThemedItem>
        </Toggle>
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
