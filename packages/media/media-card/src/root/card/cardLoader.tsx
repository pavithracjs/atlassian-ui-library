import * as React from 'react';
import { CardLoading } from '../../utils/lightCards/cardLoading';
import { Card, CardProps } from './index';

interface AsyncCardProps {
  Card?: typeof Card;
}

export default class CardLoader extends React.PureComponent<
  CardProps & AsyncCardProps,
  AsyncCardProps
> {
  static displayName = 'AsyncCard';
  static Card?: typeof Card;

  state = {
    Card: CardLoader.Card,
  };

  componentDidMount() {
    if (!this.state.Card) {
      import(/* webpackChunkName:"@atlaskit-internal_Card" */
      './index').then(module => {
        CardLoader.Card = module.Card;
        this.setState({ Card: module.Card });
      });
    }
  }

  render() {
    const { dimensions } = this.props;

    if (!this.state.Card) {
      return <CardLoading dimensions={dimensions} />;
    }

    return <this.state.Card {...this.props} />;
  }
}
