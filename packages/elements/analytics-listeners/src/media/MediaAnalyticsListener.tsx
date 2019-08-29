import * as React from 'react';
import {
  AnalyticsListener,
  UIAnalyticsEventHandler,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { DEFAULT_SOURCE, GasPayload } from '@atlaskit/analytics-gas-types';
import { sendEvent } from '../analytics-web-client-wrapper';
import { ListenerProps, FabricChannel } from '../types';
import { mergeEventData } from './mergeData';
import { getPackageInfo } from '../atlaskit/extract-data-from-event';

function getPackageHierarchy(event: UIAnalyticsEvent): string | void {
  const packages = getPackageInfo(event);
  return (
    packages
      .map(p =>
        p.packageVersion
          ? `${p.packageName}@${p.packageVersion}`
          : p.packageName,
      )
      .join(',') || undefined
  );
}

function attachPackageHierarchy(
  event: UIAnalyticsEvent,
  attributes: { [key: string]: any },
) {
  const packageHierarchy = getPackageHierarchy(event);
  return !attributes && !packageHierarchy
    ? {}
    : {
        attributes: {
          ...attributes,
          ...(packageHierarchy ? { packageHierarchy } : {}),
        },
      };
}

export default class MediaAnalyticsListener extends React.Component<
  ListenerProps
> {
  listenerHandler: UIAnalyticsEventHandler = event => {
    const { client, logger } = this.props;
    logger.debug('Received Media event', event);
    const eventMergedPayload = mergeEventData(event);
    if (eventMergedPayload) {
      const payloadAttributes = attachPackageHierarchy(
        event,
        eventMergedPayload.attributes,
      );
      const payload = {
        source: DEFAULT_SOURCE,
        ...eventMergedPayload,
        ...payloadAttributes,
        tags: eventMergedPayload.tags
          ? Array.from(new Set([...eventMergedPayload.tags, 'media']))
          : ['media'],
      } as GasPayload;
      sendEvent(logger, client)(payload);
    }
  };

  render() {
    return (
      <AnalyticsListener
        onEvent={this.listenerHandler}
        channel={FabricChannel.media}
      >
        {this.props.children}
      </AnalyticsListener>
    );
  }
}
