import React, { Component } from 'react';
import StyledSkeleton from '../styled/Skeleton';
import { SkeletonProps } from '../types';

export default class Skeleton extends Component<SkeletonProps> {
  static defaultProps = {
    appearance: 'circle',
    size: 'medium',
    weight: 'normal',
  };

  render() {
    return <StyledSkeleton {...this.props} />;
  }
}
