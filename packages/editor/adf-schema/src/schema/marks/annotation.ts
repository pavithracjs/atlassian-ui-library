import { MarkSpec } from 'prosemirror-model';

/**
 * @name anntoation_marker
 * @description Annotation marker
 */
export interface AnnotationDefinition {
  type: 'annotation ';
  attrs: {
    localId: string;
  };
}

export const annotation: MarkSpec = {
  inclusive: false,
  excludes: '',
  attrs: {
    localId: {
      default: '',
    },
  },
  parseDOM: [{ tag: 'span[data-mark-type="annotation"]' }],
  toDOM(node) {
    return [
      'span',
      {
        'data-mark-type': 'annotation',
        'data-localId': node.attrs.localId,
      },
    ];
  },
};
