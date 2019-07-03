// @flow
import type { ComponentType, Node } from 'react';
import type { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type DrawerWidth = 'narrow' | 'medium' | 'wide' | 'extended' | 'full';

export type BaseProps = {
  /** The content of the drawer */
  children: Node,
  /** Icon to be rendered in your drawer as a component, if available */
  icon?: ComponentType<*>,
  /** Available drawer sizes */
  width: DrawerWidth,
};

export type DrawerPrimitiveProps = BaseProps & {
  in: boolean,
  onClose?: (SyntheticMouseEvent<*>) => void,
  onCloseComplete?: (node: HTMLElement) => void,
  shouldUnmountOnExit?: boolean,
};

export type DrawerProps = BaseProps & {
  ...WithAnalyticsEventsProps,
  /**
      Callback function to be called when the drawer will be closed.
    */
  onClose?: (
    SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
    analyticsEvent: any,
  ) => void,
  /** A callback function that will be called when the drawer has finished its close transition. */
  onCloseComplete?: (node: HTMLElement) => void,
  /**
      Callback function that will be called when the drawer is displayed and `keydown` event is triggered.
    */
  onKeyDown?: (SyntheticKeyboardEvent<*>) => void,
  /** Controls if the drawer is open or close */
  isOpen: boolean,
  /** Boolean that controls if drawer should be retained/discarded */
  shouldUnmountOnExit?: boolean,
  /**
    Boolean indicating whether to focus on the first tabbable element inside the drawer.
  */
  autoFocusFirstElem?: boolean,
  /**
   *     Boolean indicating if the focus lock is active or not.
   */

  isFocusLockEnabled?: boolean,
  /**
    Whether to return the focus to the previous active element on closing the drawer
  */
  shouldReturnFoucs?: boolean,
};

type DnDType = {
  draggableProps: {
    style: ?Object,
    'data-react-beautiful-dnd-draggable': string,
  },
  dragHandleProps: ?Object,
  innerRef: Function,
  placeholder?: Node,
};

export type ItemProps = {
  /** Whether the Item should attempt to gain browser focus when mounted */
  autoFocus?: boolean,
  /** Main content to be shown inside the item. */
  children?: Node,
  /** Secondary text to be shown underneath the main content. */
  description?: string,
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
  isCompact?: boolean,
  /** Causes the item to appear in a disabled state and click behaviours will not be triggered. */
  isDisabled?: boolean,
  /** Used to apply correct dragging styles when also using react-beautiful-dnd. */
  isDragging?: boolean,
  /** Causes the item to still be rendered, but with `display: none` applied. */
  isHidden?: boolean,
  /** Causes the item to appear with a persistent selected background state. */
  isSelected?: boolean,
  /** Function to be called when the item is clicked, Receives the MouseEvent. */
  onClick?: Function,
  /** Function to be called when the item is pressed with a keyboard,
   * Receives the KeyboardEvent. */
  onKeyDown?: Function,
  /** Standard onmouseenter event */
  onMouseEnter?: Function,
  /** Standard onmouseleave event */
  onMouseLeave?: Function,
  /** Allows the role attribute of the item to be altered from it's default of
   *  `role="button"` */
  role?: string,
  /** Target frame for item `href` link to be aimed at. */
  target?: string,
  /** Standard browser title to be displayed on the item when hovered. */
  title?: string,
};

/**
  Type of keyboard event that triggers which key will should close the drawer.
*/
export type CloseTrigger = 'backButton' | 'blanket' | 'escKey';
