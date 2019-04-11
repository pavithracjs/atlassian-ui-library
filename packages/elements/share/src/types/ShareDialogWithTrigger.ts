import { ShareError } from './ShareContentState';

export type RenderCustomTriggerButton = (
  args: { onClick: () => void; loading?: boolean; error?: ShareError },
) => React.ReactNode;

export type DialogPlacement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';
