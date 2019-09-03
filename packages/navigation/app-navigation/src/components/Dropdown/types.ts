import React, { ComponentType, ReactNode } from 'react';

export type DropdownProps = {
  dropdownContent: ComponentType<{}>;
  children: ReactNode;
  isOpen?: boolean;
  onClose?: (event: React.MouseEvent<HTMLElement>) => void;
  position: 'top left' | 'top right';
};
