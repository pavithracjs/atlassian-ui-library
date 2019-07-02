// @flow

import React, { type Node } from 'react';
import Item from '@atlaskit/item';

type DnDType = {
  draggableProps: {
    style: ?Object,
    'data-react-beautiful-dnd-draggable': string,
  },
  dragHandleProps: ?Object,
  innerRef: Function,
  placeholder?: Node,
};

type Props = {
  /** Whether the Item should attempt to gain browser focus when mounted */
  autofocus?: boolean,
  /** Main content to be shown inside the item. */
  children?: Node,
  /** Secondary text to be shown underneath the main content. */
  description: string,
  /** Drag and drop props provided by react-beautiful-dnd. Please do not use
   * this unless using react-beautiful-dnd */
  dnd?: DnDType,
  /** Content to be shown after the main content. Shown to the right of content (or to the left
   * in RTL mode). */
  elemAfter?: Node,
  /** Content to be shown before the main content. Shown to the left of content (or to the right
   * in RTL mode). */
  elemBefore?: Node,
  /** Link that the user will be redirected to when the item is clicked. If omitted, a
   *  non-hyperlink component will be rendered. */
  href?: string,
  /** Causes the item to be rendered with reduced spacing. */
  isCompact: boolean,
  /** Causes the item to appear in a disabled state and click behaviours will not be triggered. */
  isDisabled: boolean,
  /** Used to apply correct dragging styles when also using react-beautiful-dnd. */
  isDragging?: boolean,
  /** Causes the item to still be rendered, but with `display: none` applied. */
  isHidden: boolean,
  /** Causes the item to appear with a persistent selected background state. */
  isSelected?: boolean,
  onClick?: Function,
  /** Standard onmouseenter event */
  onMouseEnter?: Function,
  /** Standard onmouseleave event */
  onMouseLeave?: Function,
  /** Allows the role attribute of the item to be altered from it's default of
   *  `role="button"` */
  role: string,
  /** Target frame for item `href` link to be aimed at. */
  target?: string,
  /** Standard browser title to be displayed on the item when hovered. */
  title?: string,
};

export const DrawerItems = (props: Props) => {
  const {
    autofocus,
    children,
    description,
    dnd,
    elemAfter,
    elemBefore,
    href,
    isCompact,
    isDisabled,
    isDragging,
    isHidden,
    isSelected,
    onClick,
    onMouseEnter,
    onMouseLeave,
    target,
    title,
  } = props;

  return (
    <Item
      autofocus={autofocus}
      description={description}
      elemAfter={elemAfter}
      elemBefore={elemBefore}
      href={href}
      isCompact={isCompact}
      isDisabled={isDisabled}
      isDragging={isDragging}
      isHidden={isHidden}
      isSelected={isSelected}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      target={target}
      title={title}
      {...dnd}
    >
      {children}
    </Item>
  );
};
