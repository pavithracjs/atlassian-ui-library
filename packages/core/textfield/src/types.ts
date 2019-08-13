import React from 'react';
import { ThemeProp } from '@atlaskit/theme';
import { ThemeProps, ThemeTokens } from './theme';

export interface Overrides {
  Container?: {
    attributes?: () => React.HTMLAttributes<HTMLElement>;
  };
  Input?: {
    attributes?: () => React.InputHTMLAttributes<HTMLInputElement>;
  };
}

// External component
export interface PublicProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
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
  /** Sets maximum width of input */
  width?: string | number;
  /** The theme the component should use. */
  theme?: ThemeProp<ThemeTokens, ThemeProps>;
  /** Mousedown handler that will fire on the container element */
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
}

export interface InternalProps extends PublicProps {
  forwardedRef: React.Ref<HTMLInputElement>;
}
