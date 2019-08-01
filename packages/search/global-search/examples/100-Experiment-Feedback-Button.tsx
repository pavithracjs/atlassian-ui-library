import * as React from 'react';
import StorybookQuickSearch from '../example-helpers/StorybookQuickSearch';

export default class extends React.Component {
  render() {
    return (
      <StorybookQuickSearch
        showFeedbackCollector={true}
        feedbackCollectorProps={{
          name: 'abcdef',
          email: 'abcdef@atlassian.com',
        }}
      />
    );
  }
}
