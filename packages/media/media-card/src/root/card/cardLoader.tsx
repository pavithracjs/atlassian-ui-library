import * as React from 'react';
import { CardLoading } from '../../utils/lightCards/cardLoading';
import { withMediaClient, WithMediaClientProps } from '@atlaskit/media-client';
import { CardProps } from '../../index';

type CardWithMediaClientConfigProps = WithMediaClientProps<CardProps>;
type CardWithMediaClientConfigComponent = React.ComponentType<
  CardWithMediaClientConfigProps
>;

interface AsyncCardProps {
  Card?: CardWithMediaClientConfigComponent;
}

export default class CardLoader extends React.PureComponent<
  CardWithMediaClientConfigProps & AsyncCardProps,
  AsyncCardProps
> {
  static displayName = 'AsyncCard';
  static Card?: CardWithMediaClientConfigComponent;

  state = {
    Card: CardLoader.Card,
  };

  componentDidMount() {
    if (!this.state.Card) {
      import(/* webpackChunkName:"@atlaskit-internal_Card" */
      './index').then(module => {
        CardLoader.Card = withMediaClient(module.Card);
        this.setState({ Card: CardLoader.Card });
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
