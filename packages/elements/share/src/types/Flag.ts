export type FlagType = 'object-shared' | 'admin-notified';

export type Flag = {
  id: number;
  type: FlagType;
};
