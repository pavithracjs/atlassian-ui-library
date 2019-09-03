import { BadgeProps } from '@atlaskit/badge';
import { TriggerManagerProps } from '../TriggerManager/types';

type BuiltinBadge = {
  type: 'builtin';
  fabricNotificationLogUrl: string;
  cloudId: string;
};

type RequiredBadgeProps = Omit<BadgeProps, 'children'>;

type ProvidedBadge = RequiredBadgeProps & {
  type: 'provided';
  count: number;
};

export type NotificationsProps = Omit<
  TriggerManagerProps,
  'children' | 'drawerContent'
> & {
  badge: BuiltinBadge | ProvidedBadge;
  drawerContent?: TriggerManagerProps['drawerContent'] | 'builtin';
  locale?: string;
  product: string;
  tooltip: string;
};
