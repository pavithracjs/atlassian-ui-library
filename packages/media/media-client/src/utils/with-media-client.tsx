import * as React from 'react';
import {
  MediaClientConfig,
  MediaClientConfigContext,
} from '@atlaskit/media-core';
import { MediaClient } from '..';

export interface WithMediaClientProps {
  readonly mediaClient: MediaClient;
}

export interface WithOptionalMediaClientProps {
  readonly mediaClient?: MediaClient;
}

export function withMediaClient<P>(
  Component: React.ComponentType<P & WithOptionalMediaClientProps>,
) {
  const mediaClientsMap = new Map<MediaClientConfig, MediaClient>();

  return class extends React.Component<P> {
    render() {
      return (
        <MediaClientConfigContext.Consumer>
          {mediaClientConfig => {
            let mediaClient: MediaClient | undefined;

            if (mediaClientConfig) {
              mediaClient = mediaClientsMap.get(mediaClientConfig);
              if (!mediaClient) {
                mediaClient = new MediaClient(mediaClientConfig);
                mediaClientsMap.set(mediaClientConfig, mediaClient);
              }
            }

            return <Component {...this.props} mediaClient={mediaClient} />;
          }}
        </MediaClientConfigContext.Consumer>
      );
    }
  };
}
