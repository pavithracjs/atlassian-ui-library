import React from 'react';
import BreadcrumbsStateless from './BreadcrumbsStateless';

interface IState {
  isExpanded?: boolean;
}

interface IProps {
  maxItems?: number;
}

export default class Breadcrumbs extends React.Component<IProps, IState> {
  state = { isExpanded: false };

  expand = () => this.setState({ isExpanded: true });

  render() {
    return (
      <BreadcrumbsStateless
        {...this.props}
        isExpanded={this.state.isExpanded}
        onExpand={this.expand}
      />
    );
  }
}
