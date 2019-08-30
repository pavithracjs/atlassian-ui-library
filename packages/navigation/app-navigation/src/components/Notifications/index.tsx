/** @jsx jsx */
import Badge from '@atlaskit/badge';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogClient } from '@atlaskit/notification-log-client';
import { jsx } from '@emotion/core';
import { ComponentType } from 'react';

import { BadgeContainer } from '../BadgeContainer';
import { IconButton } from '../IconButton';
import { TriggerManager } from '../TriggerManager';
import NotificationDrawer from './NotificationDrawer';
import { NotificationsProps } from './types';

export const Notifications = (props: NotificationsProps) => {
  const {
    badge,
    drawerContent,
    locale,
    product,
    tooltip,
    ...triggerManagerProps
  } = props;
  let resolvedBadge: any | undefined;
  if (badge.type === 'builtin') {
    resolvedBadge = () => (
      <NotificationIndicator
        notificationLogProvider={Promise.resolve(
          new NotificationLogClient(
            badge.fabricNotificationLogUrl,
            badge.cloudId,
          ),
        )}
        refreshRate={60000}
      />
    );
  } else {
    const { count, ...badgeProps } = badge;
    resolvedBadge = () => count > 0 && <Badge {...badgeProps}>{count}</Badge>;
  }

  let drawer: ComponentType<{}> | undefined;
  if (drawerContent === 'builtin') {
    drawer = () => <NotificationDrawer locale={locale} product={product} />;
  } else if (props.dropdownContent) {
    // If dropdownContent has been provided, don't set up the drawer.
    drawer = undefined;
  } else {
    drawer = drawerContent;
  }

  return (
    <TriggerManager {...triggerManagerProps} drawerContent={drawer}>
      {({ onTriggerClick }) => (
        <BadgeContainer badge={resolvedBadge}>
          <IconButton
            icon={<NotificationIcon label={tooltip} />}
            onClick={onTriggerClick}
            tooltip={tooltip}
          />
        </BadgeContainer>
      )}
    </TriggerManager>
  );
};
