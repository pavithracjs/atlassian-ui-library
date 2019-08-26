import * as React from 'react';
import Item from '@atlaskit/item';
import {
  createAndFireNavigationEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  UI_EVENT_TYPE,
  SWITCHER_ITEM_SUBJECT,
} from '../utils/analytics';
import { FadeIn } from './fade-in';

interface SwitcherItemProps extends WithAnalyticsEventsProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  description?: React.ReactNode;
  onClick?: Function;
  href?: string;
  isDisabled?: boolean;
  onKeyDown?: any;
}

class SwitcherItem extends React.Component<SwitcherItemProps> {
  render() {
    const { icon, description, ...rest } = this.props;
    return (
      <FadeIn>
        <Item elemBefore={icon} description={description} {...rest} />
      </FadeIn>
    );
  }
}

const SwitcherItemWithEvents = withAnalyticsEvents({
  onClick: createAndFireNavigationEvent({
    eventType: UI_EVENT_TYPE,
    action: 'clicked',
    actionSubject: SWITCHER_ITEM_SUBJECT,
  }),
})(SwitcherItem);

export default SwitcherItemWithEvents;
