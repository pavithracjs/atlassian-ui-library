import * as React from 'react';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import withNavigation from '../example-helpers/withNavigation';
import { GlobalQuickSearch } from '../src';
import PrefetchedResultsProvider from '../src/components/PrefetchedResultsProvider';
import {
  AnalyticsListener as AnalyticsNextListener,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

const GlobalQuickSearchWrapper = withNavigation(GlobalQuickSearch);

class NoNavigationLinkComponent extends React.Component<any> {
  onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    this.props.onClick();
    e.preventDefault();
    console.log('Navigating to', this.props.href);
  };

  render() {
    /* eslint-disable-next-line */
    return <a {...this.props} onClick={this.onClick} />;
  }
}

export default class GlobalQuickSearchExample extends React.Component {
  componentWillMount() {
    setupMocks({
      crossProductSearchDelay: 2000,
      abTestExperimentId: 'faster-search',
    });
  }

  componentWillUnmount() {
    teardownMocks();
  }

  onEvent(data: UIAnalyticsEvent) {
    console.log(
      'Recieved analytic event',
      JSON.stringify(data.payload, null, 2),
    );
  }

  render() {
    return (
      <AnalyticsNextListener channel="fabric-elements" onEvent={this.onEvent}>
        <PrefetchedResultsProvider context="confluence" cloudId="123">
          <GlobalQuickSearchWrapper
            linkComponent={NoNavigationLinkComponent as any}
          />
        </PrefetchedResultsProvider>
      </AnalyticsNextListener>
    );
  }
}
