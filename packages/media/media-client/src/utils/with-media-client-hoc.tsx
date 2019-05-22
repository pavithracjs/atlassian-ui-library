import * as React from 'react';
import { Context, MediaClientConfig } from '@atlaskit/media-core';
import { MediaClient } from '..';
import { XOR } from '@atlaskit/type-helpers';

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

const getMediaClient = (props: WithContextOrMediaClientConfig) => {
  const { mediaClientConfig } = props;
  if (mediaClientConfig) {
    let mediaClient: MediaClient | undefined;

    mediaClient = mediaClientsMap.get(mediaClientConfig);
    if (!mediaClient) {
      mediaClient = new MediaClient(mediaClientConfig);
      mediaClientsMap.set(mediaClientConfig, mediaClient);
    }
    return mediaClient;
  } else {
    // Context is only created in ContextFactory. And value of it is MediaClient.
    return props.context as MediaClient;
  }
};

export const withMediaClient = <P extends {}>(
  Component: React.ComponentType<P & WithMediaClient>,
) => {
  return class extends React.Component<P & WithContextOrMediaClientConfig> {
    render() {
      const props = this.props;
      return <Component {...props} mediaClient={getMediaClient(this.props)} />;
    }
  };
};
