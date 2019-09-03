import { TriggerManagerProps } from '../TriggerManager/types';

export type SearchProps = Omit<TriggerManagerProps, 'children'> & {
  text: string;
  tooltip: string;
};
