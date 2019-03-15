import * as React from 'react';
import { AnalyticsListener } from '../../../core/analytics-next/src/';
import { HelpPanel } from '../src';
import withNavigation from '../example-helpers/withNavigation';

const HelpPanelWrapper = withNavigation(HelpPanel);

const logEvent = event => {
  const { eventType, action, actionSubject, actionSubjectId } = event.payload;
  console.debug(
    `${eventType} | ${action} ${actionSubject} ${actionSubjectId}`,
    event.payload.attributes,
    event.payload,
  );
};

export default class GlobalQuickSearchExample extends React.Component {
  componentWillMount() {}

  componentWillUnmount() {}

  render() {
    return (
      <AnalyticsListener onEvent={logEvent} channel="fabric-elements">
        <HelpPanelWrapper />
      </AnalyticsListener>
    );
  }
}
