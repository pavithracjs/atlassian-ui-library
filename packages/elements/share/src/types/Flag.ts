export const OBJECT_SHARED = 'object-shared';

export const ADMIN_NOTIFIED = 'admin-notified';

export type FlagType = 'object-shared' | 'admin-notified';

export type Flag = {
  id: number;
  type: FlagType;
};
