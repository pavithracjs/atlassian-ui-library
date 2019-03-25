// @flow

import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { NAVIGATION_CHANNEL } from '../../constants';
import type { DrawerName } from './types';

export const analyticsIdMap: { [drawerName: DrawerName]: string } = {
  search: 'quickSearchDrawer',
  notification: 'notificationsDrawer',
  create: 'createDrawer',
  starred: 'starDrawer',
  settings: 'settingsDrawer',
  atlassianSwitcher: 'atlassianSwitcherDrawer',
};

export const fireDrawerDismissedEvents = (
  drawerName: DrawerName,
  analyticsEvent: UIAnalyticsEvent,
  trigger?: string,
): void => {
  if (
    analyticsEvent.payload.attributes &&
    analyticsEvent.payload.attributes.trigger === 'xFlow'
  ) {
    const keyboardShortcutEvent = analyticsEvent.clone().update(() => ({
      action: 'pressed',
      actionSubject: 'keyboardShortcut',
      actionSubjectId: 'dismissDrawer',
      attributes: {
        key: 'Esc',
      },
    }));
    keyboardShortcutEvent.fire(NAVIGATION_CHANNEL);
  }

  if (trigger) {
    analyticsEvent
      .update(
        analyticsEv =>
          console.log(analyticsEv) || {
            action: 'dismissed',
            actionSubject: 'drawer',
            actionSubjectId: analyticsIdMap[drawerName],
            attributes: { ...analyticsEv.attributes, trigger },
          },
      )
      .fire(NAVIGATION_CHANNEL);
    return;
  }

  analyticsEvent
    .update({
      actionSubjectId: analyticsIdMap[drawerName],
      ...(trigger ? { attributes: { trigger } } : {}),
    })
    .fire(NAVIGATION_CHANNEL);
};
