import { ComponentType, ReactNode } from 'react';
import { TriggerManagerProps } from '../TriggerManager/types';

export type PrimaryButtonProps = Omit<TriggerManagerProps, 'children'> & {
  /** A custom component to render instead of the default wrapper component.
   * Could used to render a router Link, for example. The component will be
   * provided with a className, children and onClick props, which should be passed on to the
   * element you render. */
  component?: ComponentType<any>;
  /** An href which this item links to. If this prop is provided the item will render as an <a>. */
  href?: string;
  /** A unique identifier for the item. Used for analytics. */
  id?: string;
  /** Whether this item should display as being selected. */
  isSelected?: boolean;
  /** The HTML target attribute. Will only be used if href is also set. */
  target?: string;
  /**  */
  testId?: string;
  /** A string or node to render as the main content of the item. */
  text: ReactNode;
  /** A string to render as a tooltip */
  tooltip?: string;
};
