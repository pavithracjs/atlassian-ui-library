import * as React from 'react';
import { Card } from '@atlaskit/smart-card';
import { EventHandlers, UnsupportedBlock } from '@atlaskit/editor-common';

import { getEventHandler } from '../../utils';
import { CardErrorBoundary } from './fallback';

export default function BlockCard(props: {
  url?: string;
  data?: object;
  eventHandlers?: EventHandlers;
}) {
  const { url, data, eventHandlers } = props;
  const handler = getEventHandler(eventHandlers, 'smartCard');
  const onClick = url && handler ? () => handler(url) : undefined;

  const cardProps = { url, data, onClick };
  return (
    <CardErrorBoundary unsupportedComponent={UnsupportedBlock} {...cardProps}>
      <Card appearance="block" {...cardProps} />
    </CardErrorBoundary>
  );
}
