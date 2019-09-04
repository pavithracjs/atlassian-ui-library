import * as React from 'react';
import { Context, MediaClientConfig } from '@atlaskit/media-core';
import { MediaClient } from '../client/media-client';
import { Omit, XOR } from '@atlaskit/type-helpers';

export interface WithContext {
  context: Context;
}

export interface WithMediaClientConfig {
  mediaClientConfig: MediaClientConfig;
}

export interface WithMediaClient {
  mediaClient: MediaClient;
}

export type WithContextOrMediaClientConfig = XOR<
  WithContext,
  WithMediaClientConfig
>;

const mediaClientsMap = new Map<MediaClientConfig, MediaClient>();

export const getMediaClient = (
  props: WithContextOrMediaClientConfig,
): MediaClient => {
  const { mediaClientConfig } = props;
  if (mediaClientConfig) {
    let mediaClient: MediaClient | undefined = mediaClientsMap.get(
      mediaClientConfig,
    );

    if (!mediaClient) {
      mediaClient = new MediaClient(mediaClientConfig);
      mediaClientsMap.set(mediaClientConfig, mediaClient);
    }
    return mediaClient;
  }

  // Context is only created in ContextFactory. And value of it is MediaClient.
  return props.context as MediaClient;
};

export type WithContextOrMediaClientConfigProps<
  P extends WithMediaClient
> = Omit<P, 'mediaClient'> & WithContextOrMediaClientConfig;

export type WithMediaClientFunction = <P extends WithMediaClient>(
  Component: React.ComponentType<P>,
) => React.ComponentType<WithContextOrMediaClientConfigProps<P>>;

export const withMediaClient: WithMediaClientFunction = <
  P extends WithMediaClient
>(
  Component: React.ComponentType<P>,
) => {
  return class extends React.Component<WithContextOrMediaClientConfigProps<P>> {
    render() {
      const props = this.props;
      return (
        <Component {...props as any} mediaClient={getMediaClient(this.props)} />
      );
    }
  };
};
