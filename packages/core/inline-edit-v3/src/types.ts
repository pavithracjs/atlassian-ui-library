import * as React from 'react';

export interface Props {
  /** Label above the input */
  label?: string;
  /** Component to be shown when not in edit view */
  readView: React.ReactChild;
  /** Component to be shown when editing. Should be an Atlaskit input. */
  editView: (fieldProps: Object) => React.ReactChild;
  /** Whether the component shows the readView or the editView. */
  isEditing: boolean;
  /** The initial value of the inline edit. */
  defaultValue: any;
  /** Validation function handled by final-form. */
  validate?: (
    value: any,
    formState: Object,
    fieldState: Object,
  ) => string | void | Promise<string | void>;
  /** Handler called when readView is clicked. */
  onEditRequested: () => void;
  /**
   * Handler called editView is closed and changes are confirmed.
   * Field value is passed as an argument to this function.
   */
  onConfirm: (value: any) => void;
  /** Handler called when checkmark is. */
  onCancel: () => void;

  /** Contained in defaultProps */
  /** Set whether onConfirm should be called on blur. */
  disableConfirmOnBlur?: boolean;
  /** Sets whether the checkmark and cross are displayed in the bottom right of the field. */
  hideActionButtons?: boolean;
  /** The text announced to screen readers when focusing on the edit button. */
  editButtonLabel?: string;
  /** The text announced to screen readers when focusing on the confirm button. */
  confirmButtonLabel?: string;
  /** The text announced to screen readers when focusing on the cancel button. */
  cancelButtonLabel?: string;
}

export type RenderChildrenProps = {
  /** Label above the input */
  label?: string;
  /** Whether the component shows the readView or the editView. */
  isEditing: boolean;
  /** The initial value of the inline edit. */
  defaultValue: any;
  /** Validation function handled by final-form. */
  validate?: (
    value: any,
    formState: Object,
    fieldState: Object,
  ) => string | void | Promise<string | void>;
  /** Handler called when readView is clicked. */
  onEditRequested: () => void;
  /**
   * Handler called editView is closed and changes are confirmed.
   * Field value is passed as an argument to this function.
   */
  onConfirm: (value: any) => void;
  /** Handler called when checkmark is. */
  onCancel: () => void;
  /** Elements to render inside InlineEdit */
  children: (isEditing: boolean, fieldProps?: FieldProps) => React.ReactChild;

  /** Contained in defaultProps */
  /** Set whether onConfirm should be called on blur. */
  disableConfirmOnBlur: boolean;
  /** Sets whether the checkmark and cross are displayed in the bottom right of the field. */
  hideActionButtons: boolean;
  /** The text announced to screen readers when focusing on the edit button. */
  editButtonLabel: string;
  /** The text announced to screen readers when focusing on the confirm button. */
  confirmButtonLabel: string;
  /** The text announced to screen readers when focusing on the cancel button. */
  cancelButtonLabel: string;
};

/** These interfaces will be exported from the Form package once it is converted to Typescript */
export interface FormProps {
  onSubmit: (e: React.FormEvent) => void;
  ref: React.RefObject<HTMLFormElement>;
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
