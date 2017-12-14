// @flow
import React, { PureComponent } from 'react';
import Row from './Row';
import LoaderRow from './LoaderRow';
import { type DataFunction } from './../types';

type Props = {
  childrenData: Object,
  getChildrenData: DataFunction,
  depth?: number,
  render?: Function,
};

type State = {
  isLoaderShown?: boolean,
};

export default class RowChildren extends PureComponent<Props, State> {
  constructor() {
    super();
    this.handleLoadingFinished = this.handleLoadingFinished.bind(this);
  }

  componentWillMount() {
    this.setState({
      isLoaderShown: this.isLoadingData(this.props.childrenData),
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.childrenData !== this.props && this.props.childrenData) {
      if (this.isLoadingData(nextProps.childrenData)) {
        this.setState({ isLoaderShown: true });
      }
    }
  }

  isLoadingData(data) {
    return !data;
  }

  handleLoadingFinished() {
    this.setState({
      isLoaderShown: false,
    });
  }

  renderLoader() {
    const isCompleting = !this.isLoadingData(this.props.childrenData);
    return (
      <LoaderRow
        isCompleting={isCompleting}
        onComplete={this.handleLoadingFinished}
        depth={this.props.depth}
      />
    );
  }

  renderChildRows() {
    const {
      childrenData = [],
      getChildrenData,
      render,
      depth = 0,
    } = this.props;
    return childrenData.map((childRowData, index) => (
      <Row
        data={childRowData}
        getChildrenData={getChildrenData}
        depth={depth + 1}
        key={childRowData.id || index}
        render={render}
      />
    ));
  }

  render() {
    const { isLoaderShown } = this.state;
    return (
      <div>{isLoaderShown ? this.renderLoader() : this.renderChildRows()}</div>
    );
  }
}
