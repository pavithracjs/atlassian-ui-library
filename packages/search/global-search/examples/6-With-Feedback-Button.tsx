import * as React from 'react';
import { GlobalQuickSearch } from '../src';
import withNavigation from '../example-helpers/withNavigation';

const GlobalQuickSearchWithNavigation = withNavigation(GlobalQuickSearch);

export default class extends React.Component {
  render() {
    return (
      <GlobalQuickSearchWithNavigation
        showFeedbackCollector={true}
        feedbackCollectorProps={{
          name: 'abcdef',
          email: 'abcdef@atlassian.com',
        }}
      />
    );
  }
}
