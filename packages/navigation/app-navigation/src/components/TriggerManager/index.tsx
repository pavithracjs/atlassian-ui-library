import Drawer from '@atlaskit/drawer';
import React, { Fragment, SyntheticEvent } from 'react';

import { Dropdown } from '../Dropdown';
import { TriggerManagerProps } from './types';

export const TriggerManager = (props: TriggerManagerProps) => {
  const {
    children,
    drawerContent: DrawerContent,
    dropdownContent: DropdownContent,
    isOpen,
    onClick,
    onClose,
    onDrawerCloseComplete,
    position,
  } = props;
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const onTriggerClick = React.useCallback(
    (...args: any[]) => {
      if (DrawerContent) {
        setIsDrawerOpen(true);
      }
      if (onClick) {
        onClick(...args);
      }
    },
    [DrawerContent, onClick],
  );

  const onDrawerClose = React.useCallback(
    (...args: [SyntheticEvent<HTMLElement, Event>, any]) => {
      if (DrawerContent) {
        setIsDrawerOpen(false);
      }
      if (onClose) {
        onClose(...args);
      }
    },
    [DrawerContent, onClose],
  );

  if (DropdownContent) {
    return (
      <Dropdown
        dropdownContent={DropdownContent}
        onClose={onClose}
        position={position}
      >
        {children({ onTriggerClick })}
      </Dropdown>
    );
  }

  // TODO openFromRight
  return (
    <Fragment>
      {children({ onTriggerClick })}
      {DrawerContent && (
        <Drawer
          isOpen={isOpen !== undefined ? isOpen : isDrawerOpen}
          onClose={onDrawerClose}
          onCloseComplete={onDrawerCloseComplete}
        >
          <DrawerContent />
        </Drawer>
      )}
    </Fragment>
  );
};
