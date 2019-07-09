import { ShareError } from './ShareContentState';

export type RenderCustomTriggerButton = (
  args: {
    error?: ShareError;
    isSelected?: boolean;
    onClick: () => void;
  },
) => React.ReactNode;

// TODO: remove this and import from @atlaskit/inline-dialog when it is migrated to typescript
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
