import * as React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next-types';

interface CommonProps {
  /** Label above the input. */
  label?: string;
  /** Validation function handled by final-form. */
  validate?: (
    value: any,
    formState: {},
    fieldState: {},
  ) => string | void | Promise<string | void>;

  /** Contained in defaultProps */
  /** Set whether onConfirm should be called on blur. */
  keepEditViewOpenOnBlur?: boolean;
  /** Sets whether the checkmark and cross are displayed in the bottom right of the field. */
  hideActionButtons?: boolean;
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
  readView: () => React.ReactChild;
  /** Component to be shown when editing. Should be an Atlaskit input. */
  editView: (fieldProps: FieldProps) => React.ReactChild;
  /** Whether the component shows the readView or the editView. */
  isEditing: boolean;
  /** The value shown in the editView when it is entered. Should be updated by onConfirm. */
  editValue: any;
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
  readView: () => React.ReactChild;
  /** Component to be shown when editing. Should be an Atlaskit input. */
  editView: (
    editViewProps: FieldProps & { ref: (ref: any) => void },
  ) => React.ReactChild;
  /**
   * Handler called editView is closed and changes are confirmed.
   * Field value is passed as an argument to this function.
   */
  onConfirm: (value: any, analyticsEvent: UIAnalyticsEvent) => void;
  /** The value shown in the editView when it is entered. Should be updated by onConfirm. */
  editValue: any;
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
  editValue: any;
  /** Text shown in read view when value is an empty string. */
  emptyValueText?: string;
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
  children?: React.ReactChild;
  content?: React.ReactChild;
  isOpen?: boolean;
  onContentBlur?: () => void;
  onContentClick?: () => void;
  onContentFocus?: () => void;
  onClose?: (e: { isOpen: false; event: any }) => void;
  placement?: Placement;
}
