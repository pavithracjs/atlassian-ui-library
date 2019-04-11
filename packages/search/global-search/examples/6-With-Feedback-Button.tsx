import * as React from 'react';
import {
  GlobalQuickSearch,
  Props,
  withFeedbackButton,
  FeedbackCollectorProps,
} from '../src';
import withNavigation from '../example-helpers/withNavigation';

const GlobalSearchWithFeedback = withFeedbackButton<Props>(GlobalQuickSearch);
const GlobalQuickSearchWithFeedbackInNavigation = withNavigation<
  Props & FeedbackCollectorProps
>(GlobalSearchWithFeedback);

// nothing is working except for the feedback button
export default class extends React.Component {
  render() {
    return (
      <GlobalQuickSearchWithFeedbackInNavigation
        name={'abcdef'}
        email={'abcdef@atlassian.com'}
      />
    );
  }
}
