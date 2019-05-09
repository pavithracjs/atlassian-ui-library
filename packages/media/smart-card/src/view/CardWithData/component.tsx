import * as React from 'react';
import {
  BlockCardResolvedView,
  InlineCardResolvedView,
} from '@atlaskit/media-ui';
import { CardWithDataContentProps as Props } from './types';
import { extractInlinePropsFromJSONLD } from '../../extractors/inline';
import { extractBlockPropsFromJSONLD } from '../../extractors/block';

export class CardWithDataContent extends React.Component<Props> {
  render() {
    const { data: details, isSelected, appearance, onClick } = this.props;
    if (appearance === 'inline') {
      return (
        <InlineCardResolvedView
          {...extractInlinePropsFromJSONLD(details || {})}
          isSelected={isSelected}
          onClick={onClick}
        />
      );
    } else {
      return (
        <BlockCardResolvedView
          {...extractBlockPropsFromJSONLD(details || {})}
          isSelected={isSelected}
          onClick={onClick}
        />
      );
    }
  }
}
