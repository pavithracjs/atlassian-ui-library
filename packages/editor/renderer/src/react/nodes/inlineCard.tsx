import * as React from 'react';
import { Card } from '@atlaskit/smart-card';
import { EventHandlers, UnsupportedInline } from '@atlaskit/editor-common';

import { getEventHandler } from '../../utils';
import { CardErrorBoundary } from './fallback';

export default function InlineCard(props: {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
}) {
  const { url, data, eventHandlers } = props;
  const handler = getEventHandler(eventHandlers, 'smartCard');
  const onClick = url && handler ? () => handler(url) : undefined;

  const cardProps = { url, data, onClick };
  return (
    <CardErrorBoundary unsupportedComponent={UnsupportedInline} {...cardProps}>
      <Card appearance="inline" {...cardProps} />
    </CardErrorBoundary>
  );
}
