/** @jsx jsx */
import { DropdownMenuStateless } from '@atlaskit/dropdown-menu';
import { jsx } from '@emotion/core';
import React from 'react';
import { DropdownProps } from './types';

export const Dropdown = (props: DropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(
    props.isOpen || false,
  );
  const {
    children,
    dropdownContent: DropdownContent,
    onClose,
    position,
  } = props;

  const onOpenChange = ({
    isOpen,
    event,
  }: {
    isOpen: boolean;
    event: React.MouseEvent<HTMLElement>;
  }) => {
    setIsDropdownOpen(isOpen);
    if (!isOpen && onClose) {
      onClose(event);
    }
  };

  return (
    <DropdownMenuStateless
      isOpen={isDropdownOpen}
      onOpenChange={onOpenChange}
      position={position}
      trigger={children}
    >
      <DropdownContent />
    </DropdownMenuStateless>
  );
};

Dropdown.defaultProps = {
  position: 'top right',
};
