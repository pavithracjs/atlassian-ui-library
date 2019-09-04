import { DrawerProps as AkDrawerProps } from '@atlaskit/drawer';
import { ComponentType, ReactNode } from 'react';

type CommonProps = {
  children: (event: { onTriggerClick: (...args: any[]) => void }) => ReactNode;
};

export type DrawerProps = CommonProps & {
  /** Content to render in a drawer */
  drawerContent?: ComponentType<{}>;
  /** Whether this drawer should be open or not */
  isOpen?: boolean;
  /** A handler which will be called when the trigger is clicked. */
  onClick?: (...args: any[]) => void;
  /** A handler which will be called when the drawer is closed. */
  onClose?: AkDrawerProps['onClose'];
  /** A handler which will be called when the drawer has finished closing. */
  onDrawerCloseComplete?: AkDrawerProps['onCloseComplete'];
};

export type DropdownProps = CommonProps & {
  /** Content to render in a dropdown */
  dropdownContent?: ComponentType<{ closeDropdown?: () => void }>;
  /** Whether this dropdown should be open or not */
  isOpen?: boolean;
  /** A handler which will be called when the trigger is clicked. */
  onClick?: (...args: any[]) => void;
  /** A handler which will be called when the dropdown is closed. */
  onClose?: (event: React.MouseEvent<HTMLElement>) => void;
  /** The position to render the dropdown in. */
  position?: 'top left' | 'top right';
};

export type TriggerManagerProps = DrawerProps & DropdownProps;
