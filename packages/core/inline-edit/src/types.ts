import * as React from 'react';
import {
  UIAnalyticsEvent,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

interface CommonProps extends WithAnalyticsEventsProps {
  /** Label above the input. */
  label?: string;
  /** Validation function handled by final-form. */
  validate?: (
    value: any,
    formState: {},
    fieldState: {},
  ) => string | void | Promise<string | void>;

  /** Set whether onConfirm should be called on blur. */
  keepEditViewOpenOnBlur?: boolean;
  /** Sets whether the checkmark and cross are displayed in the bottom right of the field. */
  hideActionButtons?: boolean;
  /** Determines whether the input value can be confirmed as empty. */
  isRequired?: boolean;
  /** Determines whether the read view has 100% width within its container, or whether it fits the content. */
  readViewFitContainerWidth?: boolean;
  /** Accessibility label for button which is used to enter edit view from keyboard. */
  editButtonLabel?: string;
  /** Accessibility label for the confirm action button. */
  confirmButtonLabel?: string;
  /** Accessibility label for the cancel action button. */
  cancelButtonLabel?: string;
}

export interface InlineEditUncontrolledProps extends CommonProps {
  /** Component to be shown when not in edit view. */
  readView: () => React.ReactNode;
  /** Component to be shown when editing. */
  editView: (fieldProps: FieldProps) => React.ReactNode;
  /** Whether the component shows the readView or the editView. */
  isEditing: boolean;
  /** The value shown in the editView when it is entered. Should be updated by onConfirm. */
  defaultValue: any;
  /** Handler called when readView is clicked. */
  onEditRequested: () => void;
  /**
   * Handler called editView is closed and changes are confirmed.
   * Field value is passed as an argument to this function.
   */
  onConfirm: (value: any, analyticsEvent: UIAnalyticsEvent) => void;
  /** Handler called when checkmark is. */
  onCancel: () => void;
}

export interface InlineEditProps extends CommonProps {
  /** Component to be shown when not in edit view. */
  readView: () => React.ReactNode;
  /** Component to be shown when editing. */
  editView: (
    fieldProps: FieldProps,
    ref: React.RefObject<any>,
  ) => React.ReactNode;
  /**
   * Handler called editView is closed and changes are confirmed.
   * Field value is passed as an argument to this function.
   */
  onConfirm: (value: any, analyticsEvent: UIAnalyticsEvent) => void;
  /** The value shown in the editView when it is entered. Should be updated by onConfirm. */
  defaultValue: any;
  /** Determines whether isEditing begins as true. */
  startWithEditViewOpen?: boolean;
}

export interface InlineEditableTextfieldProps extends CommonProps {
  /**
   * Handler called editView is closed and changes are confirmed.
   * Field value is passed as an argument to this function.
   */
  onConfirm: (value: string, analyticsEvent: UIAnalyticsEvent) => void;
  /** The value shown in the editView when it is entered. Should be updated by onConfirm. */
  defaultValue: any;
  /** Text shown in read view when value is an empty string. */
  placeholder: string;
  /** Determines whether isEditing begins as true. */
  startWithEditViewOpen?: boolean;
  /** Sets height to compact. */
  isCompact?: boolean;
}

/** These interfaces will be exported from the Form package once it is converted to Typescript */
export interface FormProps {
  onSubmit: (e: React.FormEvent | any) => void;
  ref: React.RefObject<HTMLFormElement>;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export interface FormChildProps {
  formProps: FormProps;
  dirty: boolean;
  submitting: boolean;
  disabled: boolean;
  getValues: () => {};
}

export interface FieldProps {
  id: string;
  isRequired: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
  onChange: (e: any) => any;
  onBlur: () => any;
  onFocus: () => any;
  value: any;
  'aria-invalid': 'true' | 'false';
  'aria-labelledby': string;
}

export interface Meta {
  dirty: boolean;
  touched: boolean;
  valid: boolean;
  error: any;
  submitError: any;
}

export interface FieldChildProps {
  fieldProps: FieldProps;
  error: any;
  meta: Meta;
}

/** This interface will be exported once Inline Dialog is converted to Typescript */
export type Placement =
  | 'auto-start'
  | 'auto'
  | 'auto-end'
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'right-start'
  | 'right'
  | 'right-end'
  | 'bottom-end'
  | 'bottom'
  | 'bottom-start'
  | 'left-end'
  | 'left'
  | 'left-start';

export interface InlineDialogProps {
  children?: React.ReactNode;
  content?: React.ReactNode;
  isOpen?: boolean;
  onContentBlur?: () => void;
  onContentClick?: () => void;
  onContentFocus?: () => void;
  onClose?: (e: { isOpen: false; event: any }) => void;
  placement?: Placement;
}
