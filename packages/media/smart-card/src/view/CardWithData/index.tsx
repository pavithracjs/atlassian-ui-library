import * as React from 'react';
import { CardAppearance } from '../Card/types';
import {
  BlockCardResolvedView,
  InlineCardResolvedView,
} from '@atlaskit/media-ui';

import { DefinedState } from '../../client/types';
import { extractInlinePropsFromJSONLD } from '../../extractors/inline';
import { extractBlockPropsFromJSONLD } from '../../extractors/block';

export interface CardWithDataContentProps {
  appearance: CardAppearance;
  data: DefinedState['data'];
  onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
  isSelected?: boolean;
}

export class CardWithDataContent extends React.Component<
  CardWithDataContentProps
> {
  render() {
    const { data, isSelected, appearance, onClick } = this.props;

    if (appearance === 'inline') {
      return (
        <InlineCardResolvedView
          {...extractInlinePropsFromJSONLD(data || {})}
          isSelected={isSelected}
          onClick={onClick}
        />
      );
    } else {
      return (
        <BlockCardResolvedView
          {...extractBlockPropsFromJSONLD(data || {})}
          isSelected={isSelected}
          onClick={onClick}
        />
      );
    }
  }
}
