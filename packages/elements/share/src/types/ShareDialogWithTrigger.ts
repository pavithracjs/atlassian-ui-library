import { ShareError } from './ShareContentState';

export type RenderCustomTriggerButton = (
  args: { onClick: () => void; loading?: boolean; error?: ShareError },
) => React.ReactNode;
