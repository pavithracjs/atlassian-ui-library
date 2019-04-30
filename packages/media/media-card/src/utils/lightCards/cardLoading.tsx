import * as React from 'react';
import { Component } from 'react';
import FileIcon from '@atlaskit/icon/glyph/file';
import { getDimensionsWithDefault } from './getDimensionsWithDefault';
import { Wrapper } from './styled';
import { StaticCardProps } from './types';

export class CardLoading extends Component<StaticCardProps, {}> {
  render() {
    const dimensions = getDimensionsWithDefault(this.props.dimensions);
    return <Wrapper dimensions={dimensions}>{this.icon}</Wrapper>;
  }

  get icon() {
    return <FileIcon label="loading" size="medium" />;
  }
}
