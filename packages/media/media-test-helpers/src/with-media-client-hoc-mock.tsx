import * as React from 'react';
import { MediaClient } from '@atlaskit/media-client';

export const fakeWithMediaClient = (mediaClient: MediaClient) => (
  Component: React.ComponentType,
) => (props: any) => <Component {...props} mediaClient={mediaClient} />;
