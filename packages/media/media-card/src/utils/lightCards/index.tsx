import * as React from 'react';
import { Component } from 'react';

import FileIcon from '@atlaskit/icon/glyph/file';
import { Wrapper } from './styled';
import { CardDimensions } from '../..';
import { ErrorIcon } from '../errorIcon';

export interface StaticCardProps {
  dimensions?: CardDimensions;
}

export const getDimensionsWithDefault = (
  dimensions: CardDimensions = { width: '100%', height: '100%' },
): CardDimensions => {
  return {
    height:
      typeof dimensions.height === 'number'
        ? `${dimensions.height}px`
        : dimensions.height,
    width:
      typeof dimensions.width === 'number'
        ? `${dimensions.width}px`
        : dimensions.width,
  };
};

export class CardLoading extends Component<StaticCardProps, {}> {
  render() {
    const dimensions = getDimensionsWithDefault(this.props.dimensions);

    return <Wrapper dimensions={dimensions}>{this.icon}</Wrapper>;
  }

  get icon() {
    return <FileIcon label="loading" size="medium" />;
  }
}

export interface ErrorCardProps extends StaticCardProps {
  readonly size: 'small' | 'medium' | 'large' | 'xlarge';
}

export class CardError extends Component<ErrorCardProps, {}> {
  static defaultProps = {
    size: 'medium',
  };

  render() {
    const dimensions = getDimensionsWithDefault(this.props.dimensions);
    return <Wrapper dimensions={dimensions}>{this.icon}</Wrapper>;
  }

  get icon() {
    const { size } = this.props;

    return <ErrorIcon size={size} />;
  }
}
