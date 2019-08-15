import * as React from 'react';
import { WithContextOrMediaClientConfigProps } from '@atlaskit/media-client';
import { CardProps, CardLoading } from '../..';

export type CardWithMediaClientConfigProps = WithContextOrMediaClientConfigProps<
  CardProps
>;
type CardWithMediaClientConfigComponent = React.ComponentType<
  CardWithMediaClientConfigProps
>;

export interface AsyncCardState {
  Card?: CardWithMediaClientConfigComponent;
}

export default class CardLoader extends React.PureComponent<
  CardWithMediaClientConfigProps & AsyncCardState,
  AsyncCardState
> {
  static displayName = 'AsyncCard';
  static Card?: CardWithMediaClientConfigComponent;

  state: AsyncCardState = {
    Card: CardLoader.Card,
  };

  async componentDidMount() {
    try {
      if (!this.state.Card) {
        const [mediaClient, cardModule] = await Promise.all([
          import(/* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
          import(/* webpackChunkName:"@atlaskit-internal_Card" */ './index'),
        ]);

        CardLoader.Card = mediaClient.withMediaClient(cardModule.Card);
        this.setState({ Card: CardLoader.Card });
      }
    } catch (error) {
      // TODO [MS-2272]: Add operational error to catch async import error
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
