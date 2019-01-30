// Common Translations will live here
import { defineMessages } from 'react-intl';

export default defineMessages({
  layoutFixedWidth: {
    id: 'fabric.editor.layoutFixedWidth',
    defaultMessage: 'Set width as fixed (680px)',
    description:
      'Display your element (image, table, extension, etc) as standard width',
  },
  layoutWide: {
    id: 'fabric.editor.layoutWide',
    defaultMessage: 'Set width as flexible (3/4 screen)',
    description:
      'Display your element (image, table, extension, etc) wider than normal',
  },
  layoutFullWidth: {
    id: 'fabric.editor.layoutFullWidth',
    defaultMessage: 'Set width as flexible (full screen)',
    description:
      'Display your element (image, table, extension, etc) as full width',
  },
  alignImageRight: {
    id: 'fabric.editor.alignImageRight',
    defaultMessage: 'Align right',
    description: 'Aligns image to the right',
  },
  alignImageCenter: {
    id: 'fabric.editor.alignImageCenter',
    defaultMessage: 'Align center',
    description: 'Aligns image to the center',
  },
  alignImageLeft: {
    id: 'fabric.editor.alignImageLeft',
    defaultMessage: 'Align left',
    description: 'Aligns image to the left',
  },
  remove: {
    id: 'fabric.editor.remove',
    defaultMessage: 'Remove',
    description:
      'Delete the element (image, panel, table, etc.) from your document',
  },
  visit: {
    id: 'fabric.editor.visit',
    defaultMessage: 'Open link in a new window',
    description: '',
  },
});
