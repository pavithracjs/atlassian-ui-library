import React from 'react';
import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type ChildrenType = React.ReactChild;
export type ComponentType = React.Component<{}, {}>;
export type ElementType = React.ReactChild;

export interface CheckboxIconProps {
  /** Sets the checkbox icon active state. */
  isActive?: boolean;
  /** Sets whether the checkbox is checked or unchecked. */
  isChecked?: boolean;
  /** Sets whether the checkbox is disabled. */
  isDisabled?: boolean;
  /** Sets the checkbox focus */
  isFocused?: boolean;
  /**
   * Sets whether the checkbox is indeterminate. This only affects the
   * style and does not modify the isChecked property.
   */
  isIndeterminate?: boolean;
  /** Sets the checkbox as invalid */
  isInvalid?: boolean;
  /** Sets the checkbox icon hovered state */
  isHovered?: boolean;
  /** Primary color */
  primaryColor?: any;
  /** Secondary color */
  secondaryColor?: any;
  /** The label for icon to be displayed */
  label: any;
  theme: (
    current: (props: ThemeProps) => ThemeTokens,
    props: ThemeProps,
  ) => ThemeTokens;
}

export interface CheckboxProps extends WithAnalyticsEventsProps {
  /** Sets whether the checkbox begins checked. */
  defaultChecked?: boolean;
  /** id assigned to input */
  id?: string;
  /** Callback to receive a reference.  */
  inputRef?: (input: HTMLInputElement | null | undefined) => any;
  /** Sets whether the checkbox is checked or unchecked. */
  isChecked?: boolean;
  /** Sets whether the checkbox is disabled. */
  isDisabled?: boolean;
  /** Sets whether the checkbox should take up the full width of the parent. */
  isFullWidth?: boolean;
  /**
   * Sets whether the checkbox is indeterminate. This only affects the
   * style and does not modify the isChecked property.
   */
  isIndeterminate?: boolean;
  /** Marks the field as invalid. Changes style of unchecked component. */
  isInvalid?: boolean;
  /** Marks the field as required & changes the label style. */
  isRequired?: boolean;
  /**
   * The label to be displayed to the right of the checkbox. The label is part
   * of the clickable element to select the checkbox.
   */
  label?: React.ReactChild;
  /** The name of the submitted field in a checkbox. */
  name?: string;
  /**
   * Function that is called whenever the state of the checkbox changes. It will
   * be called with an object containing the react synthetic event. Use currentTarget to get value, name and checked
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => any;
  theme?: (
    current: (props: ThemeProps) => ThemeTokens,
    props: ThemeProps,
  ) => ThemeTokens;
  /** The value to be used in the checkbox input. This is the value that will be returned on form submission. */
  value?: number | string;
}

interface ModeValue {
  light: string;
  dark: string;
}
type TokenValue = ModeValue | string;

export interface ComponentTokens {
  label: {
    [LabelKey in keyof ThemeLabelTokens]?: ThemeLabelTokens[LabelKey] extends string
      ? ThemeLabelTokens[LabelKey]
      : { [LabelProperty in keyof ThemeLabelTokens[LabelKey]]?: TokenValue }
  };
  icon: {
    [IconKey in keyof ThemeIconTokens]?: ThemeIconTokens[IconKey] extends string
      ? ThemeIconTokens[IconKey]
      : { [IconProperty in keyof ThemeIconTokens[IconKey]]?: TokenValue }
  };
  requiredIndicator?: {
    textColor?: {
      rest?: string;
    };
  };
}

export interface ThemeIconTokens {
  borderWidth: string;
  borderColor: {
    rest: string;
    disabled: string;
    checked: string;
    active: string;
    invalid: string;
    focused: string;
    hovered: string;
  };
  boxColor: {
    rest: string;
    disabled: string;
    active: string;
    hoveredAndChecked: string;
    hovered: string;
    checked: string;
  };
  tickColor: {
    rest: string;
    disabledAndChecked: string;
    activeAndChecked: string;
    checked: string;
  };
  size: 'small' | 'medium' | 'large' | 'xlarge';
}

export interface ThemeLabelTokens {
  textColor: {
    rest: string;
    disabled: string;
  };
  spacing: {
    bottom: string;
    right: string;
    left: string;
    top: string;
  };
}

export interface ThemeTokens {
  label: ThemeLabelTokens;
  icon: ThemeIconTokens;
  requiredIndicator: {
    textColor: {
      rest: string;
    };
  };
}

export interface ThemeProps {
  tokens: ComponentTokens;
  mode: string;
}
