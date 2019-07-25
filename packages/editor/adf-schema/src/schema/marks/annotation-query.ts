import { MarkSpec } from 'prosemirror-model';
import { SEARCH_QUERY } from '../groups';
import { Y75 } from '../../utils/colors';

export const annotationQuery: MarkSpec = {
  excludes: `${SEARCH_QUERY}`,
  inclusive: false,
  group: SEARCH_QUERY,
  parseDOM: [{ tag: 'span[data-annotation-query]' }],
  toDOM() {
    return [
      'span',
      {
        'data-annotation-query': 'true',
        style: `background-color: ${Y75}`,
      },
    ];
  },
  attrs: {
    trigger: { default: '' },
  },
};
