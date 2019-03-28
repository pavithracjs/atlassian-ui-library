import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  formTitle: {
    id: 'fabric.elements.share.form.title',
    defaultMessage: 'Share',
    description: 'Title for Share form.',
  },
  formSend: {
    id: 'fabric.elements.share.form.send',
    defaultMessage: 'Send',
    description: 'Label for Share form submit button.',
  },
  formRetry: {
    id: 'fabric.elements.share.form.retry',
    defaultMessage: 'Retry',
    description: 'Label for Share from retry button.',
  },
  commentPlaceholder: {
    id: 'fabric.elements.share.form.comment.placeholder',
    defaultMessage: 'Add a message',
    description: 'Placeholder for the comment field in Share form.',
  },
  userPickerPlaceholder: {
    id: 'fabric.elements.share.form.user-picker.placeholder',
    defaultMessage: 'Enter name, team or email',
    description: 'Placeholder for the user picker field in Share form.',
  },
  userPickerAddMoreMessage: {
    id: 'fabric.elements.share.form.user-picker.add-more',
    defaultMessage: 'Enter more',
    description:
      'Message to encourage the user to add more items to user picker in Share form.',
  },
  userPickerRequiredMessage: {
    id: 'fabric.elements.share.form.user-picker.validation.required',
    defaultMessage: 'Select at least one user, team or email.',
    description:
      'Required error message for the user picker field in Share form.',
  },
  userPickerNoOptionsMessageEmptyQuery: {
    id: 'fabric.elements.share.form.user-picker.no-options.emptyQuery',
    defaultMessage: `We couldn’t find any results. Invite people by using an email address.`,
    description:
      'No options message displayed when the search for users returns empty for an empty query.',
  },
  userPickerNoOptionsMessage: {
    id: 'fabric.elements.share.form.user-picker.no-options',
    defaultMessage: `We couldn’t find any results for "{inputValue}". Invite people by using an email address.`,
    description:
      'No options message displayed when the search for users returns empty.',
  },
  shareTriggerButtonText: {
    id: 'fabric.elements.share.trigger.button.text',
    defaultMessage: 'Share',
    description: 'Default text for the Share Dialog trigger button',
  },
  copyLinkButtonText: {
    id: 'fabric.elements.share.copylink.button.text',
    defaultMessage: 'Copy link',
    description: 'Default text for the Copy Link button',
  },
  copiedToClipboardMessage: {
    id: 'fabric.elements.share.copied.to.clipboard.message',
    defaultMessage: 'Link copied to clipboard',
    description: 'Default text for the Copy Link button',
  },
  capabilitiesInfoMessage: {
    id: 'fabric.elements.share.form.capabilities.info.message',
    defaultMessage: 'Your invite will be sent to an admin for approval',
    description: 'Default text for capabilities info',
  },
  shareFailureMessage: {
    id: 'fabric.elements.share.failure.message',
    defaultMessage: 'Unable to share',
    description:
      'Default text for share failure message displayed in the tooltip',
  },
  shareSuccessMessage: {
    id: 'fabric.elements.share.success.message',
    defaultMessage: '{object} shared',
    description: 'Default text for share success message displayed in a flag',
  },
  adminNotifiedMessage: {
    id: 'fabric.elements.share.admin.notified.message',
    defaultMessage: 'Your admin has been notified',
    description:
      'Default text for admin notified message displayed in a flag when a share action is successful',
  },
});
