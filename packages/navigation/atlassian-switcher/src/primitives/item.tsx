import * as React from 'react';
import Item from '@atlaskit/item';
import { WithAnalyticsEventsProps } from '../utils/analytics';
import { FadeIn } from './fade-in';

export interface SwitcherItemProps extends WithAnalyticsEventsProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  description?: React.ReactNode;
  onClick?: Function;
  href?: string;
  isDisabled?: boolean;
  onKeyDown?: any;
}

export default class SwitcherItem extends React.Component<SwitcherItemProps> {
  render() {
    const { icon, description, ...rest } = this.props;
    return (
      <FadeIn>
        <Item elemBefore={icon} description={description} {...rest} />
      </FadeIn>
    );
  }
}
