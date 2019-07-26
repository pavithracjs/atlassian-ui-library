import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

type ScrollToTopProps = RouteComponentProps<any>;

class ScrollToTop extends React.Component<ScrollToTopProps> {
  componentDidUpdate(prevProps: ScrollToTopProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return null;
  }
}

export default withRouter(ScrollToTop);
