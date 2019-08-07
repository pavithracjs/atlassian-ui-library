import { ThemeProp } from '@atlaskit/theme';
import { Node } from 'react';
import { ThemeProps, ThemeTokens } from './theme';

export interface InputProps {
  /** Controls the appearance of the field.
   * `subtle` shows styling on hover.
   * `none` hides all field styling.
   */
  appearance?: 'standard' | 'none' | 'subtle',
  /** Element after input in textfield. */
  elemAfterInput?: Node,
  /** Element before input in textfield. */
  elemBeforeInput?: Node,
  /** Handler called when the input loses focus. */
  onBlur?: (e: SyntheticEvent<HTMLInputElement>) => mixed,
  /** Handler called when the input receives focus. */
  onFocus?: (e: SyntheticEvent<HTMLInputElement>) => mixed,
  /** Handler called when mouse is pressed down. */
  onMouseDown: (e: SyntheticMouseEvent<*>) => mixed,
  /** Handler called when mouse enters input. */
  onMouseEnter: () => void,
  /** Handler called when mouse leaves input. */
  onMouseLeave: () => void,
  /** Set whether the fields should expand to fill available horizontal space. */
  isCompact?: boolean,
  /** Sets the field as uneditable, with a changed hover state. */
  isDisabled?: boolean,
  /** Sets styling to indicate that the input is focused. */
  isFocused?: boolean,
  /** Sets styling to indicate that the input is invalid */
  isInvalid?: boolean,
  /** Sets content text value to monospace */
  isMonospaced?: boolean,
  /** If true, prevents the value of the input from being edited. */
  isReadOnly?: boolean,
  /** Add asterisk to label. Set required for form that the field is part of. */
  isRequired?: boolean,
  /** Forwarded ref */
  forwardedRef: (?HTMLInputElement) => void,
  theme: ThemeTokens,
};

export interface TextFieldProps {
  /** Controls the appearance of the field.
   * `subtle` shows styling on hover.
   * `none` hides all field styling.
   */
  appearance: 'standard' | 'none' | 'subtle',
  /** This prop is injected by analytics-next and has no use within textfield */
  createAnalyticsEvent: (SyntheticEvent<>) => void,
  /** Sets a default value as input value */
  defaultValue?: string,
  /** Element after input in textfield. */
  elemAfterInput?: Node,
  /** Element before input in textfield. */
  elemBeforeInput?: Node,
  /** Applies compact styling, making the field smaller */
  isCompact: boolean,
  /** Sets the field as uneditable, with a changed hover state. */
  isDisabled: boolean,
  /** Sets styling to indicate that the input is focused. */
  isFocused: boolean,
  /** Sets styling to indicate that the input is invalid */
  isInvalid: boolean,
  /** Sets content text value to monospace */
  isMonospaced: boolean,
  /** If true, prevents the value of the input from being edited. */
  isReadOnly?: boolean,
  /** Set required for form that the field is part of. */
  isRequired?: boolean,
  /** Handler to be called when the input loses focus. */
  onBlur?: (e: SyntheticEvent<HTMLInputElement>) => mixed,
  /** Handler to be called when the input receives focus. */
  onFocus?: (e: SyntheticEvent<HTMLInputElement>) => mixed,
  /** Handler called when mouse is pressed down. */
  onMouseDown: (e: SyntheticMouseEvent<*>) => mixed,
  /** Sets maximum width of input */
  width?: string | number,
  /** The value of the input. */
  value?: string | number,
  /** This is an internal prop. Use "ref" prop to get a reference to input element. */
  forwardedRef: (?HTMLInputElement) => void,
  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>,
};
