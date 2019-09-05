import React from 'react';

import { Notifications } from '../../src';
import { mockNotificationsEndpoint } from './mock-notifications-endpoint';

const onClick = (...args: any[]) => {
  console.log('notifications click', ...args);

  // Notification URL is unreachable from the examples.
  // Hence setting it to root
  // Wait for the drawer to open and mount the iframe.
  setTimeout(() => {
    const iframes: NodeListOf<HTMLIFrameElement> = document.querySelectorAll(
      'iFrame[title="Notifications"]',
    );
    iframes.forEach(iframe => {
      iframe.src = '/';
      iframe.srcdoc = 'notifications drawer iframe';
    });
  }, 50);
};

const CLOUD_ID = 'some-cloud-id';
const FABRIC_NOTIFICATION_LOG_URL = '/gateway/api/notification-log/';

const builtinBadge = {
  type: 'builtin' as const,
  fabricNotificationLogUrl: FABRIC_NOTIFICATION_LOG_URL,
  cloudId: CLOUD_ID,
};

export const mockBuiltInNotifications = () => {
  mockNotificationsEndpoint(
    `/gateway/api/notification-log/api/2/notifications/count/unseen?cloudId=${CLOUD_ID}`,
    3,
  );
};

const onClose = (...args: any[]) => {
  console.log('notifications close', ...args);
};

const onDrawerCloseComplete = (...args: any[]) => {
  console.log('notifications drawer close complete', ...args);
};

export const BuiltInNotifications = () => (
  <Notifications
    badge={builtinBadge}
    drawerContent="builtin"
    locale="en"
    onClick={onClick}
    onClose={onClose}
    onDrawerCloseComplete={onDrawerCloseComplete}
    product="jira"
    tooltip="Notifications"
  />
);
