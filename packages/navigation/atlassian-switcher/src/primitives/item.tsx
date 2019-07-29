import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Item, { itemThemeNamespace } from '@atlaskit/item';
import { gridSize } from '@atlaskit/theme';
import {
  createAndFireNavigationEvent,
  withAnalyticsEvents,
  UI_EVENT_TYPE,
  SWITCHER_ITEM_SUBJECT,
} from '../utils/analytics';
import { FadeIn } from './fade-in';

const itemTheme = {
  padding: {
    default: {
      bottom: gridSize(),
      left: gridSize(),
      top: gridSize(),
      right: gridSize(),
    },
  },
};

export interface SwitcherChildItem {
  label: string;
  href: string;
}

type SwitcherItemProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
  description?: React.ReactNode;
  onClick?: Function;
  href?: string;
  isDisabled?: boolean;
  childItems?: SwitcherChildItem[];
};

interface SwitcherItemState {
  showChildItems: boolean;
}

class SwitcherItem extends React.Component<
  SwitcherItemProps,
  SwitcherItemState
> {
  constructor(props: SwitcherItemProps) {
    super(props);
    this.state = {
      showChildItems: false,
    };
  }

  toggleChildItemsVisibility(event: React.SyntheticEvent) {
    event.preventDefault();
    this.setState({
      showChildItems: !this.state.showChildItems,
    });
  }

  render() {
    const { icon, description, childItems, ...rest } = this.props;
    return (
      <FadeIn>
        <ThemeProvider theme={{ [itemThemeNamespace]: itemTheme }}>
          <React.Fragment>
            <Item
              elemBefore={icon}
              elemAfter={
                childItems && this.toggleChildItemsVisibility.length > 0 ? (
                  <div onClick={e => this.toggleChildItemsVisibility(e)}>
                    down
                  </div>
                ) : (
                  undefined
                )
              }
              description={description}
              {...rest}
            />
            {this.state.showChildItems &&
              childItems &&
              childItems.map(item => (
                <Item href={item.href} key={item.label}>
                  {item.label}
                </Item>
              ))}
          </React.Fragment>
        </ThemeProvider>
      </FadeIn>
    );
  }
}

const SwitcherItemWithEvents = withAnalyticsEvents<SwitcherItemProps>({
  onClick: createAndFireNavigationEvent({
    eventType: UI_EVENT_TYPE,
    action: 'clicked',
    actionSubject: SWITCHER_ITEM_SUBJECT,
  }),
})(SwitcherItem);

export default SwitcherItemWithEvents;
