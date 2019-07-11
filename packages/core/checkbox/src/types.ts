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
  theme: (
    current: Function,
    props: { tokens: ComponentTokens; mode: 'light' | 'dark' },
  ) => ComponentTokens;
  /** The value to be used in the checkbox input. This is the value that will be returned on form submission. */
  value?: number | string;
}

interface ModeValue {
  light?: string;
  dark?: string;
}
interface LabelTokens {
  textColor?: {
    rest?: ModeValue;
    disabled?: ModeValue;
  };
}
interface IconTokens {
  borderColor?: {
    rest?: ModeValue;
    disabled?: ModeValue;
    checked?: ModeValue;
    active?: ModeValue;
    invalid?: ModeValue;
    focused?: ModeValue;
    hovered?: ModeValue;
  };
  boxColor?: {
    rest?: ModeValue;
    disabled?: ModeValue;
    active?: ModeValue;
    hoveredAndChecked?: ModeValue;
    hovered?: ModeValue;
    checked?: ModeValue;
  };
  tickColor?: {
    rest?: ModeValue;
    disabledAndChecked?: ModeValue;
    activeAndChecked?: ModeValue;
    checked?: ModeValue;
  };
  size?: 'small' | 'medium' | 'large';
}
export interface ComponentTokens {
  label?: LabelTokens;
  icon?: IconTokens;
}

export interface EvaluatedTokens {
  label: {
    textColor: {
      rest: string;
      disabled: string;
    };
  };
  icon: {
    borderColor: {
      rest?: string;
      disabled?: string;
      checked?: string;
      active?: string;
      invalid?: string;
      focused?: string;
      hovered?: string;
    };
    boxColor: {
      rest?: string;
      disabled?: string;
      active?: string;
      hoveredAndChecked?: string;
      hovered?: string;
      checked?: string;
    };
    tickColor: {
      rest?: string;
      disabledAndChecked?: string;
      activeAndChecked?: string;
      checked?: string;
    };
    size?: 'small' | 'medium' | 'large';
  };
}
