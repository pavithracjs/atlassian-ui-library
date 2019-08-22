import { WithAnalyticsEventsProps } from '@atlaskit/analytics-next';

export type Sizes = 'regular' | 'large';

export interface BaseProps extends WithAnalyticsEventsProps {
  /** Whether the toggle is disabled or not. This will prevent any interaction with the user */
  isDisabled?: boolean;
  /** Label to be set for accessibility */
  label?: string;
  /** Descriptive name for value property to be submitted in a form */
  name?: string;
  /** The value to be submitted in a form. */
  value?: string;
  /** Handler to be called when toggle is unfocused */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Handler to be called when native 'change' event happens internally. */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Handler to be called when toggle is focused. */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** Defines the size of the toggle. */
  size?: Sizes;
}

export interface StatefulProps extends BaseProps {
  /** Whether the toggle is initially checked or not
   * After initial mount whether the component is checked or not is
   * controlled by the component */
  isDefaultChecked: boolean;
}

export interface StatelessProps extends BaseProps {
  /** Whether the toggle is checked or not */
  isChecked?: boolean;
}

export interface StyledProps {
  isChecked?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  size: Sizes;
}
