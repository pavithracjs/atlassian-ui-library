import { TriggerManagerProps } from '../TriggerManager/types';

export type AppSwitcherProps = Omit<TriggerManagerProps, 'children'> & {
  tooltip: string;
};
