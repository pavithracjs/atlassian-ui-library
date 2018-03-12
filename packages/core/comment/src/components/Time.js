// @flow

import React, { Component, type Node } from 'react';
import {
  withAnalyticsEvents,
  createAndFireEvent,
  withAnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import Field from './Field';
import { name, version } from '../../package.json';

type Props = {
  /** The time of the comment. */
  children?: Node,
  /** The URL of the link. If not provided, the element will be rendered as text. */
  href?: string,
  /** Handler called when the element is clicked. The second argument can be used
   * to track analytics events. See documentation in analytics-next package for details. */
  onClick?: (e: SyntheticEvent<>, analyticsEvent: UIAnalyticsEvent) => void,
  /** Handler called when the element is focused. The second argument can be used
   * to track analytics events. See documentation in analytics-next package for details. */
  onFocus?: (e: SyntheticEvent<>, analyticsEvent: UIAnalyticsEvent) => void,
  /** Handler called when the element is moused over. The second argument can be used
   * to track analytics events. See documentation in analytics-next package for details. */
  onMouseOver?: (e: SyntheticEvent<>, analyticsEvent: UIAnalyticsEvent) => void,
};

export class Time extends Component<Props> {
  render() {
    const { children, href, onClick, onFocus, onMouseOver } = this.props;
    return (
      <Field
        href={href}
        onClick={onClick}
        onFocus={onFocus}
        onMouseOver={onMouseOver}
      >
        {children}
      </Field>
    );
  }
}

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');
export default withAnalyticsContext({
  component: 'comment-time',
  package: name,
  version,
})(
  withAnalyticsEvents({
    onClick: createAndFireEventOnAtlaskit({ action: 'click' }),
    onFocus: createAndFireEventOnAtlaskit({ action: 'focus' }),
    onMouseOver: createAndFireEventOnAtlaskit({ action: 'mouseover' }),
  })(Time),
);
