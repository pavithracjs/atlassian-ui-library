import { ComponentType, SyntheticEvent, ReactChild } from 'react';
import {
  WithAnalyticsEventProps,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

export type Widths = {
  full: string;
  extended: string;
  narrow: number;
  medium: number;
  wide: number;
};

export type DrawerWidth = keyof Widths;

export type IconProps = { size: string };

export type BaseProps = {
  /** The content of the drawer */
  children: ReactChild;
  /** Icon to be rendered in your drawer as a component, if available */
  icon?: ComponentType<IconProps>;
  /** Available drawer sizes */
  width: DrawerWidth;
};

export type DrawerPrimitiveProps = BaseProps & {
  in: boolean;
  onClose?: (event: SyntheticEvent) => void;
  onCloseComplete?: (node: HTMLElement) => void;
  shouldUnmountOnExit?: boolean;
};

export type DrawerProps = BaseProps &
  WithAnalyticsEventProps & {
    /**
      Callback function to be called when the drawer will be closed.
    */
    onClose?: (
      event: SyntheticEvent,
      analyticsEvent?: UIAnalyticsEvent,
    ) => void;
    /** A callback function that will be called when the drawer has finished its close transition. */
    onCloseComplete?: (node: HTMLElement) => void;
    /**
      Callback function that will be called when the drawer is displayed and `keydown` event is triggered.
    */
    onKeyDown?: (event: SyntheticEvent) => void;
    /** Controls if the drawer is open or close */
    isOpen: boolean;
    /** Boolean that controls if drawer should be retained/discarded */
    shouldUnmountOnExit?: boolean;
  };

/**
  Type of keyboard event that triggers which key will should close the drawer.
*/
export type CloseTrigger = 'backButton' | 'blanket' | 'escKey';
