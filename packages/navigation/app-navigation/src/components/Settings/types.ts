import { TriggerManagerProps } from '../TriggerManager/types';

export type SettingsProps = Omit<TriggerManagerProps, 'children'> & {
  tooltip: string;
};
