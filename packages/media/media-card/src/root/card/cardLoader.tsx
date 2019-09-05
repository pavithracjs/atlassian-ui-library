import * as React from 'react';
import { WithContextOrMediaClientConfigProps } from '@atlaskit/media-client';
import { CardProps, CardLoading } from '../..';
import { MediaCardAnalyticsErrorBoundaryProps } from '../media-card-analytics-error-boundary';

export type CardWithMediaClientConfigProps = WithContextOrMediaClientConfigProps<
  CardProps
>;
type CardWithMediaClientConfigComponent = React.ComponentType<
  CardWithMediaClientConfigProps
>;

type MediaCardErrorBoundaryComponent = React.ComponentType<
  MediaCardAnalyticsErrorBoundaryProps
>;

export interface AsyncCardState {
  Card?: CardWithMediaClientConfigComponent;
  MediaCardErrorBoundary?: MediaCardErrorBoundaryComponent;
}

export default class CardLoader extends React.PureComponent<
  CardWithMediaClientConfigProps & AsyncCardState,
  AsyncCardState
> {
  static displayName = 'AsyncCard';
  static Card?: CardWithMediaClientConfigComponent;
  static MediaCardErrorBoundary?: MediaCardErrorBoundaryComponent;

  state: AsyncCardState = {
    Card: CardLoader.Card,
    MediaCardErrorBoundary: CardLoader.MediaCardErrorBoundary,
  };

  async componentDidMount() {
    if (!this.state.Card) {
      try {
        const [
          mediaClient,
          cardModule,
          mediaCardErrorBoundaryModule,
        ] = await Promise.all([
          import(/* webpackChunkName:"@atlaskit-media-client" */ '@atlaskit/media-client'),
          import(/* webpackChunkName:"@atlaskit-internal_Card" */ './index'),
          import(/* webpackChunkName:"@atlaskit-internal_MediaCardErrorBoundary" */ '../media-card-analytics-error-boundary'),
        ]);

        CardLoader.Card = mediaClient.withMediaClient(cardModule.Card);
        CardLoader.MediaCardErrorBoundary =
          mediaCardErrorBoundaryModule.default;

        this.setState({
          Card: CardLoader.Card,
          MediaCardErrorBoundary: CardLoader.MediaCardErrorBoundary,
        });
      } catch (error) {
        // TODO [MS-2278]: Add operational error to catch async import error
      }
    }
  }

  render() {
    const { dimensions } = this.props;
    const { Card, MediaCardErrorBoundary } = this.state;

    if (!Card || !MediaCardErrorBoundary) {
      return <CardLoading dimensions={dimensions} />;
    }

    return (
      <MediaCardErrorBoundary>
        <Card {...this.props} />
      </MediaCardErrorBoundary>
    );
  }
}
