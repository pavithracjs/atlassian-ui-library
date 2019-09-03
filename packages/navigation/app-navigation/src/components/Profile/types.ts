import { IconButtonProps } from '../IconButton/types';
import { TriggerManagerProps } from '../TriggerManager/types';

export type ProfileProps = Omit<TriggerManagerProps, 'children'> & {
  avatar?: IconButtonProps['icon'];
  tooltip: string;
};
