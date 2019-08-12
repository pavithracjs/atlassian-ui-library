import React, { InputHTMLAttributes, HTMLAttributes } from 'react';
import { ThemeProp } from '@atlaskit/theme';
import { ThemeProps, ThemeTokens } from './theme';

export interface InputProps {
  name: string | undefined;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  placeholder: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  defaultValue: string | string[] | undefined;
  value: string | number | string[] | undefined;
}

export interface ContainerProps {
  onMouseDown: React.MouseEventHandler<HTMLElement>;
  onMouseEnter: React.MouseEventHandler<HTMLElement>;
  onMouseLeave: React.MouseEventHandler<HTMLElement>;
}

export interface Overrides {
  Container?: {
    attributes?: (props: ContainerProps) => HTMLAttributes<HTMLElement>;
  };
  Input?: {
    attributes?: (props: InputProps) => InputHTMLAttributes<HTMLInputElement>;
  };
}

// External component
export interface PublicProps {
  /* The name attribute to be applied to the input element */
  name?: string | undefined;
  /** The value of the input. */
  value?: string | number;
  /** Sets a default value as input value */
  defaultValue?: string;
  /** Placeholder value to be set when there is no input */
  placeholder?: string;
  /** Controls the appearance of the field.
   * `subtle` shows styling on hover.
   * `none` hides all field styling.
   */
  appearance: 'standard' | 'none' | 'subtle';
  /** Applies compact styling, making the field smaller */
  isCompact: boolean;
  /** Sets the field as uneditable, with a changed hover state. */
  isDisabled: boolean;
  /** Sets styling to indicate that the input is invalid */
  isInvalid: boolean;
  /** Sets content text value to monospace */
  isMonospaced: boolean;
  /** If true, prevents the value of the input from being edited. */
  isReadOnly: boolean;
  /** Set required for form that the field is part of. */
  isRequired: boolean;
  /** Element after input in textfield. */
  elemAfterInput?: React.ReactNode;
  /** Element before input in textfield. */
  elemBeforeInput?: React.ReactNode;
  /** Handler called when the value of the input changes */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  /** Handler to be called when the input loses focus. */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Handler to be called when the input receives focus. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Handler called when mouse is pressed down. */
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  /** Sets maximum width of input */
  width?: string | number;
  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;

  overrides?: Overrides;
}

export interface InternalProps extends PublicProps {
  forwardedRef: React.Ref<HTMLInputElement>;
}
