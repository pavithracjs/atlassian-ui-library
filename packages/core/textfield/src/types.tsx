import React from 'react';
import { ThemeProp } from '@atlaskit/theme';
import { ThemeProps, ThemeTokens } from './theme';

// External component
export interface TextFieldProps {
  /** Controls the appearance of the field.
   * `subtle` shows styling on hover.
   * `none` hides all field styling.
   */
  appearance: 'standard' | 'none' | 'subtle';
  /** This prop is injected by analytics-next and has no use within textfield */
  createAnalyticsEvent: React.ReactEventHandler<HTMLInputElement>;
  /** Sets a default value as input value */
  defaultValue?: string;
  /** Element after input in textfield. */
  elemAfterInput?: React.ReactNode;
  /** Element before input in textfield. */
  elemBeforeInput?: React.ReactNode;
  /** Applies compact styling, making the field smaller */
  isCompact: boolean;
  /** Sets the field as uneditable, with a changed hover state. */
  isDisabled: boolean;
  /** Sets styling to indicate that the input is focused. */
  isFocused: boolean;
  /** Sets styling to indicate that the input is invalid */
  isInvalid: boolean;
  /** Sets content text value to monospace */
  isMonospaced: boolean;
  /** If true, prevents the value of the input from being edited. */
  isReadOnly?: boolean;
  /** Set required for form that the field is part of. */
  isRequired?: boolean;
  /** Handler to be called when the input loses focus. */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Handler to be called when the input receives focus. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Handler called when mouse is pressed down. */
  onMouseDown: React.MouseEventHandler<HTMLInputElement>;
  /** Sets maximum width of input */
  width?: string | number;
  /** The value of the input. */
  value?: string | number;
  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
}

// Internal component

export interface InputProps {
  /** Controls the appearance of the field.
   * `subtle` shows styling on hover.
   * `none` hides all field styling.
   */
  appearance?: 'standard' | 'none' | 'subtle';
  /** Element after input in textfield. */
  elemAfterInput?: React.ReactNode;
  /** Element before input in textfield. */
  elemBeforeInput?: React.ReactNode;
  /** Handler called when the input loses focus. */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Handler called when the input receives focus. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** Handler called when mouse is pressed down. */
  onMouseDown: React.MouseEventHandler<HTMLInputElement>;
  /** Handler called when mouse enters input. */
  onMouseEnter: React.MouseEventHandler<HTMLInputElement>;
  /** Handler called when mouse leaves input. */
  onMouseLeave: React.MouseEventHandler<HTMLInputElement>;
  /** Set whether the fields should expand to fill available horizontal space. */
  isCompact?: boolean;
  /** Sets the field as uneditable, with a changed hover state. */
  isDisabled?: boolean;
  /** Sets styling to indicate that the input is focused. */
  isFocused?: boolean;
  /** Sets styling to indicate that the input is hovered. */
  isHovered?: boolean;
  /** Sets styling to indicate that the input is invalid */
  isInvalid?: boolean;
  /** Sets content text value to monospace */
  isMonospaced?: boolean;
  /** If true, prevents the value of the input from being edited. */
  isReadOnly?: boolean;
  /** Add asterisk to label. Set required for form that the field is part of. */
  isRequired?: boolean;
  theme: ThemeTokens;
  // for setting the inner ref of the input
  innerRef: (ref: HTMLInputElement | null) => void;
}
