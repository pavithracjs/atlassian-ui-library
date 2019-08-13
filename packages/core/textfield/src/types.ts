import React from 'react';
import { ThemeProp } from '@atlaskit/theme';
import { ThemeProps, ThemeTokens } from './theme';

export interface InputProps {
  // always set
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  onFocus: React.FocusEventHandler<HTMLInputElement>;

  // Optional values
  name: string | undefined;
  placeholder: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  defaultValue: string | string[] | undefined;
  value: string | number | string[] | undefined;
  type: string | undefined;
}

export interface ContainerProps {
  onMouseDown: React.MouseEventHandler<HTMLElement>;
  onMouseEnter: React.MouseEventHandler<HTMLElement>;
  onMouseLeave: React.MouseEventHandler<HTMLElement>;
}

export interface Overrides {
  Container?: {
    attributes?: (props: ContainerProps) => React.HTMLAttributes<HTMLElement>;
  };
  Input?: {
    attributes?: (
      props: InputProps,
    ) => React.InputHTMLAttributes<HTMLInputElement>;
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
  /** The type of the input field */
  type?: string;
  /** Controls the appearance of the field.
   * `subtle` shows styling on hover.
   * `none` hides all field styling.
   */
  appearance?: 'standard' | 'none' | 'subtle';
  /** Applies compact styling, making the field smaller */
  isCompact?: boolean;
  /** Sets the field as uneditable, with a changed hover state. */
  isDisabled?: boolean;
  /** Sets styling to indicate that the input is invalid */
  isInvalid?: boolean;
  /** Sets content text value to monospace */
  isMonospaced?: boolean;
  /** If true, prevents the value of the input from being edited. */
  isReadOnly?: boolean;
  /** Set required for form that the field is part of. */
  isRequired?: boolean;
  /** Element after input in textfield. */
  elemAfterInput?: React.ReactNode;
  /** Element before input in textfield. */
  elemBeforeInput?: React.ReactNode;
  /** Handler called when a keydown is registered */
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
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
  /**
    Mechanism to modify attributes applied to the raw DOM elements of this component

    - `Container`: element that wraps the `input` element. It contains the `elemBeforeInput` and `elemAfterInput`
    - `Input`: raw `input` element

   This `overrides` object contains functions that are used to return the *attributes* that will be applied to the raw elements
   The functions are provided with the *attributes* we hope to apply to each element. You are welcome to monkey patch,
   and add additional *attributes* to be applied to the DOM elements.


    You can use this mechanism to apply additional React HTML props such as:

    - `spellCheck`
    - data attributes (eg `data-testid`)
    - additional event handlers (eg `onKeyUp`)
   */
  overrides?: Overrides;
}

export interface InternalProps extends PublicProps {
  forwardedRef: React.Ref<HTMLInputElement>;
}
