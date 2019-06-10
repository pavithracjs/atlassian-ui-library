import { AnalyticsEventInterface } from '@atlaskit/analytics-next';
import { ThemeProp } from '@atlaskit/theme';
import { ReactNode, ComponentType } from 'react';
import { ThemeProps, ThemeTokens } from './theme';

export enum AppearanceType {
  CIRCLE = 'circle',
  SQUARE = 'square',
}

export type PresenceType =
  | ('online' | 'busy' | 'focus' | 'offline')
  | ReactNode;

export type Size =
  | 'xsmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'xlarge'
  | 'xxlarge';

// NOTE: this won't work as an interface
// NOTE: this only works if key is optional
export type SizeType = { [key in Size]?: number };

// NOTE: sizes xsmall & xxlarge DO NOT support
// - groups
// - presence
// - status

export type SupportedSizeWithAnIcon = Pick<
  SizeType,
  Exclude<keyof SizeType, 'xsmall' | 'xxlarge'>
>;

export type StatusType = ('approved' | 'declined' | 'locked') | ReactNode;
export type StyledComponentType = 'custom' | 'button' | 'link' | 'span';

export type AvatarClickType = (
  event?: { event?: KeyboardEvent | MouseEvent; item: Object },
  analyticsEvent?: AnalyticsEventInterface,
) => void;

export interface AvatarPropTypesBase {
  /** Indicates the shape of the avatar. Most avatars are circular, but square avatars
   can be used for 'container' objects. */
  appearance: AppearanceType;
  /** Defines the size of the avatar */
  size: SizeType;
  /** Display a tooltip on hover */
  enableTooltip: boolean;
  /** Used to override the default border color of the presence indicator.
   Accepts any color argument that the border-color CSS property accepts. */
  borderColor?: string | (() => any);
  /** A custom component to use instead of the default span.
   * A `className` prop is passed to the component which has classNames for all the default styles for the avatar.
   * */
  component?: ComponentType<any>;

  /** Provides a url for avatars being used as a link. */
  href?: string;
  /** Change the style to indicate the avatar is active. */
  isActive?: boolean;
  /** Change the style to indicate the avatar is disabled. */
  isDisabled?: boolean;
  /** Change the style to indicate the avatar is focused. */
  isFocus?: boolean;
  /** Change the style to indicate the avatar is hovered. */
  isHover?: boolean;
  /** Change the style to indicate the avatar is selected. */
  isSelected?: boolean;
  /** Name will be displayed in a tooltip, also used by screen readers as fallback
   content if the image fails to load. */
  name?: string;
  /** Indicates a user's online status by showing a small icon on the avatar.
  Refer to presence values on the Presence component.
  Alternatively accepts any React element. For best results, it is recommended to
  use square content with height and width of 100%. */
  presence?: PresenceType;

  /** A url to load an image from (this can also be a base64 encoded image). */
  src?: string;
  /** Indicates contextual information by showing a small icon on the avatar.
   Refer to status values on the Status component. */
  status?: StatusType;
  /** The index of where this avatar is in the group `stack`. */
  stackIndex?: number;
  /** Assign specific tabIndex order to the underlying node. */
  tabIndex?: number;
  /** Pass target down to the anchor, if href is provided. */
  target?: '_blank' | '_self' | '_top' | '_parent';
  /** You should not be accessing this prop under any circumstances. It is
   provided by @atlaskit/analytics-next. */
  createAnalyticsEvent?: any;

  /** The theme that should be applied to the avatar. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
}

export interface AvatarPropTypes extends AvatarPropTypesBase {
  /** Handler to be called on click. */
  onClick?: AvatarClickType;
}

export interface SkeletonProps {
  /* Incidcates the shape of the skeleton */
  appearance: AppearanceType;
  /* Sets the color of the skeleton. By default it will inherit the current text color. */
  color?: string;
  /* Defines the size of the skeleton */
  size: Size;
  /* Determines the opacity of the skeleton */
  weight: 'normal' | 'strong';
}
