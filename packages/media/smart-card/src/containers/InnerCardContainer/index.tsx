import * as React from 'react';
import { v4 } from 'uuid';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next';

import { ANALYTICS_CHANNEL } from '../../utils/analytics';
import { Client, ObjectState } from '../../client';
import { CardContainerRenderProps } from '../CardContainer';

type InnerCardContainerProps = {
  client: Client;
  url: string;
  children: (renderProps: CardContainerRenderProps) => React.ReactNode;
} & WithAnalyticsEventProps;

interface InnerCardContainerState {
  prevClient?: Client;
  prevUrl?: string;
  cardState: ObjectState;
  uuid: string;
}

export default class InnerCardContainer extends React.Component<
  InnerCardContainerProps,
  InnerCardContainerState
> {
  state: InnerCardContainerState = {
    uuid: v4(),
    cardState: { status: 'pending' },
  };

  private fireAnalyticsEvent = (payload: GasPayload) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      createAnalyticsEvent(payload).fire(ANALYTICS_CHANNEL);
    }
  };

  reload = () => {
    const { cardState } = this.state;
    if (
      cardState.status === 'errored' ||
      cardState.status === 'unauthorized' ||
      cardState.status === 'forbidden'
    ) {
      const { client, url } = this.props;
      client.reload(url, this.fireAnalyticsEvent, cardState.definitionId);
    }
  };

  updateState = (incoming: [ObjectState | null, boolean]) => {
    const { url, client } = this.props;
    const [state, expired] = incoming;

    if (state === null || expired) {
      return client.resolve(url, this.fireAnalyticsEvent);
    }

    return this.setState({
      cardState: state,
    });
  };

  componentDidMount() {
    const { client, url } = this.props;
    const { uuid } = this.state;
    client.register(url).subscribe(uuid, this.updateState);
  }

  componentDidUpdate(prevProps: InnerCardContainerProps) {
    const { client, url } = this.props;
    const { uuid } = this.state;
    if (client !== prevProps.client) {
      prevProps.client.deregister(prevProps.url, uuid);
      client.register(url).subscribe(uuid, this.updateState);
    }
    if (url !== prevProps.url) {
      client.deregister(prevProps.url, uuid);
      client.register(url).subscribe(uuid, this.updateState);
    }
    return;
  }

  componentWillUnmount() {
    const { client, url } = this.props;
    const { uuid } = this.state;
    client.deregister(url, uuid);
  }

  render() {
    const { children } = this.props;
    const { cardState } = this.state;
    return children({ state: cardState, reload: this.reload });
  }
}
