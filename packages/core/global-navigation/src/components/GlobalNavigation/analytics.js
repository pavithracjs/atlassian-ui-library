// @flow

import { NAVIGATION_CHANNEL } from '../../constants';
import type { DrawerName } from './types';

export const analyticsIdMap: { [drawerName: DrawerName]: string } = {
  search: 'quickSearchDrawer',
  notification: 'notificationsDrawer',
  create: 'createDrawer',
  starred: 'starDrawer',
  help: 'helpDrawer',
  settings: 'settingsDrawer',
  invite: 'inviteDrawer',
};

export const fireDrawerDismissedEvents = (
  drawerName: DrawerName,
  analyticsEvent: any,
  trigger?: string,
): void => {
  if (
    analyticsEvent.payload.attributes &&
    analyticsEvent.payload.attributes.trigger === 'escKey'
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
      .update({
        action: 'dismissed',
        actionSubject: 'drawer',
        actionSubjectId: analyticsIdMap[drawerName],
        attributes: { trigger },
      })
      .fire(NAVIGATION_CHANNEL);
    return;
  }

  analyticsEvent
    .update({
      actionSubjectId: analyticsIdMap[drawerName],
    })
    .fire(NAVIGATION_CHANNEL);
};
