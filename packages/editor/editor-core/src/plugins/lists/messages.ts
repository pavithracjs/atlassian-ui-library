// Common Translations will live here
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  unorderedList: {
    id: 'fabric.editor.unorderedList',
    defaultMessage: 'Bullet list',
    description: 'A list with bullets. Also known as an “unordered” list',
  },
  unorderedListDescription: {
    id: 'fabric.editor.unorderedList.description',
    defaultMessage: 'Insert a bullet list',
    description: '',
  },
  orderedList: {
    id: 'fabric.editor.orderedList',
    defaultMessage: 'Numbered list',
    description: 'A list with ordered items 1… 2… 3…',
  },
  orderedListDescription: {
    id: 'fabric.editor.orderedList.description',
    defaultMessage: 'Insert a numbered list.',
    description: '',
  },
  lists: {
    id: 'fabric.editor.lists',
    defaultMessage: 'Lists',
    description: 'Menu shows ordered/bullet list and unordered/numbered lists',
  },
});
