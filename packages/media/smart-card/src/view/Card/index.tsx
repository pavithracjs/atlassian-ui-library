import * as React from 'react';
import { withAnalyticsForSumTypeProps } from '@atlaskit/analytics-next';
import { CardAppearance } from './types';
import { CardProps } from './types';
import { CardWithDataRenderer } from '../CardWithData/loader';
import { CardWithURLRenderer } from '../CardWithUrl/loader';
import { isCardWithData } from '../../utils';

class PlainCard extends React.PureComponent<CardProps> {
  render() {
    return isCardWithData(this.props) ? (
      <CardWithDataRenderer {...this.props} />
    ) : (
      <CardWithURLRenderer {...this.props} />
    );
  }
}

export const Card = withAnalyticsForSumTypeProps()(PlainCard);
export { CardAppearance, CardProps };
