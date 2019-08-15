import React from 'react';

import { AnalyticsErrorBoundary } from '@atlaskit/analytics-next';
import { FabricChannel } from '@atlaskit/analytics-listeners';

export type MediaPickerAnalyticsErrorBoundaryProps = {
  data?: { [k: string]: any };
};

export default class MediaPickerAnalyticsErrorBoundary extends React.Component<
  MediaPickerAnalyticsErrorBoundaryProps
> {
  static displayName = 'MediaPickerAnalyticsErrorBoundary';

  render() {
    const { data = {} } = this.props;
    return (
      <AnalyticsErrorBoundary channel={FabricChannel.media} data={data}>
        {this.props.children}
      </AnalyticsErrorBoundary>
    );
  }
}
