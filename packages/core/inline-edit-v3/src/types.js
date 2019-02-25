// @flow
import { type Node } from 'react';

type Props = {
  /** Label above the input */
  label?: string,
  /** Component to be shown when not in edit view */
  readView: Node,
  /** Component to be shown when editing. Should be an Atlaskit input. */
  editView: Node,
  /** Whether the component shows the readView or the editView. */
  isEditing: boolean,
  /** The initial value of the inline edit. */
  defaultValue: any,
  /** Validation function handled by final-form. */
  validate?: (
    value: any,
    formState: Object,
    fieldState: Object,
  ) => string | void | Promise<string | void>,

  /** Contained in defaultProps */
  /** Handler called when readView is clicked. */
  onEditRequested: any => mixed,
  /** Handler called editView is closed and changes are confirmed.
   * Field value is passed as an argument to this function. */
  onConfirm: any => mixed,
  /** Handler called when checkmark is. */
  onCancel: any => mixed,
  /** Set whether onConfirm should be called on blur.*/
  disableConfirmOnBlur: boolean,
  /** Sets whether the checkmark and cross are displayed in the bottom right of the field. */
  hideActionButtons: boolean,
  /** The text announced to screen readers when focusing on the edit button. */
  editButtonLabel: string,
  /** The text announced to screen readers when focusing on the confirm button. */
  confirmButtonLabel: string,
  /** The text announced to screen readers when focusing on the cancel button. */
  cancelButtonLabel: string,
};

type DefaultProps = {
  /** Handler called when readView is clicked. */
  onEditRequested: any => mixed,
  /** Handler called editView is closed and changes are confirmed.
   * Field value is passed as an argument to this function. */
  onConfirm: any => mixed,
  /** Handler called when checkmark is. */
  onCancel: any => mixed,
  /** Set whether onConfirm should be called on blur.*/
  disableConfirmOnBlur: boolean,
  /** Sets whether the checkmark and cross are displayed in the bottom right of the field. */
  hideActionButtons: boolean,
  /** The text announced to screen readers when focusing on the edit button. */
  editButtonLabel: string,
  /** The text announced to screen readers when focusing on the confirm button. */
  confirmButtonLabel: string,
  /** The text announced to screen readers when focusing on the cancel button. */
  cancelButtonLabel: string,
};
