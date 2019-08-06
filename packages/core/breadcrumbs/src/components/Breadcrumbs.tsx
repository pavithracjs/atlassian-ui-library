import React from 'react';
import Vue from 'vue';
import BreadcrumbsStateless from './BreadcrumbsStateless';
console.log(Vue); // eslint-disable-line no-console
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
