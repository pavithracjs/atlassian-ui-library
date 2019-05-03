import * as React from 'react';
import { CardLoading } from '../../utils/lightCards/cardLoading';
import {
  withMediaClient,
  WithOptionalMediaClientProps,
} from '@atlaskit/media-client';
import { CardProps } from './index';
import { BaseCardProps } from '../..';

interface State {
  Card?: React.ComponentType<CardProps>;
}

export type Props = BaseCardProps & WithOptionalMediaClientProps;

export class CardLoader extends React.PureComponent<Props, State> {
  static displayName = 'AsyncCard';
  static Card?: React.ComponentType<CardProps>;

  state = {
    Card: CardLoader.Card,
  };

  componentWillMount() {
    if (!this.state.Card) {
      import(/* webpackChunkName:"@atlaskit-internal_Card" */
      './index').then(module => {
        CardLoader.Card = module.Card;
        this.setState({ Card: module.Card });
      });
    }
  }

  render() {
    const { dimensions, mediaClient, context } = this.props;
    const contextToUse = mediaClient || context;
    if (!this.state.Card || !contextToUse) {
      return <CardLoading dimensions={dimensions} />;
    }
    const CardComponent = this.state.Card;

    // return <CardComponent {...this.props} mediaClient={mediaClient} />; // <- TODO Replace during MS-1833
    return <CardComponent {...this.props} context={contextToUse} />;
  }
}

export default withMediaClient(CardLoader);
