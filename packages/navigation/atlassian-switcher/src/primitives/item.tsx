import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Item, { itemThemeNamespace } from '@atlaskit/item';
import { colors, gridSize } from '@atlaskit/theme';
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
  hover: {
    background: colors.N20A,
  },
};

type SwitcherItemProps = {
  children: React.ReactNode;
  icon: React.ReactNode;
  description?: React.ReactNode;
  onClick?: Function;
  href?: string;
  isDisabled?: boolean;
};

class SwitcherItem extends React.Component<SwitcherItemProps> {
  render() {
    const { icon, description, ...rest } = this.props;
    return (
      <FadeIn>
        <ThemeProvider theme={{ [itemThemeNamespace]: itemTheme }}>
          <React.Fragment>
            <Item elemBefore={icon} description={description} {...rest} />
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
