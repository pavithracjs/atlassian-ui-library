import { ReactNode, SyntheticEvent } from 'react';

// Used by RadioGroupStateless
export type OptionPropType = {
  isDisabled?: boolean;
  isChecked?: boolean;
  label?: ReactNode;
  name?: string;
  value?: string | number;
};

export type OptionsPropType = Array<OptionPropType>;

export type RadioIconProps = {
  /* Boolean for field active state */
  isActive?: boolean;
  /* Field checked state */
  isChecked?: boolean;
  /* Field disabled state */
  isDisabled?: boolean;
  /* Field focused state */
  isFocused?: boolean;
  /* Field hovered state */
  isHovered?: boolean;
  /* Field invalid state */
  isInvalid?: boolean;
};

export type RadioInputProps = RadioIconProps & {
  /* Field required state */
  isRequired?: boolean;
  /* Aria-label for the hidden input */
  label?: string;
  /* Field name */
  name?: string;
  /* Optional onError callback */
  onError?: (e: SyntheticEvent<any>) => void;
  /* onChange event handler */
  onChange: (e: SyntheticEvent<any>) => void;
  /* onBlur event handler */
  onBlur: (e: SyntheticEvent<any>) => void;
  /* onFocus event handler */
  onFocus: (e: SyntheticEvent<any>) => void;
  /* onInvalid event handler, to hook into native validation */
  onInvalid?: (e: SyntheticEvent<any>) => void;
  /* Field value */
  value?: string;
};

export type RadioProps = {
  /** the aria-label attribute associated with the radio element */
  ariaLabel?: string;
  /** Field disabled */
  isDisabled?: boolean;
  /** Marks this as a required field */
  isRequired?: boolean;
  /** Field is invalid */
  isInvalid?: boolean;
  /** Set the field as checked */
  isChecked?: boolean;
  /** The label value for the input rendered to the dom */
  label?: ReactNode;
  /** Field name */
  name?: string;
  /** onChange event handler, passed into the props of each Radio Component instantiated within RadioGroup */
  onChange: (e: SyntheticEvent<any>) => void;
  onBlur?: (e: SyntheticEvent<any>) => void;
  onFocus?: (e: SyntheticEvent<any>) => void;
  onMouseDown?: (e: SyntheticEvent<any>) => void;
  onMouseUp?: (e: SyntheticEvent<any>) => void;
  onMouseEnter?: (e: SyntheticEvent<any>) => void;
  onMouseLeave?: (e: SyntheticEvent<any>) => void;
  /** onInvalid event handler, passed into the props of each Radio Component instantiated within RadioGroup */
  onInvalid?: (e: SyntheticEvent<any>) => void;
  /** Field value */
  value?: string | number;
};
