import * as React from 'react';
import { setupMocks, teardownMocks } from '../example-helpers/mockApis';
import withNavigation from '../example-helpers/withNavigation';
import { GlobalQuickSearch } from '../src';
import PrefetchedResultsProvider from '../src/components/PrefetchedResultsProvider';

const GlobalQuickSearchWrapper = withNavigation(GlobalQuickSearch);

export default class GlobalQuickSearchExample extends React.Component {
  componentWillMount() {
    setupMocks();
  }

  componentWillUnmount() {
    teardownMocks();
  }

  render() {
    return (
      <PrefetchedResultsProvider context="confluence" cloudId="123">
        <GlobalQuickSearchWrapper />
      </PrefetchedResultsProvider>
    );
  }
}
