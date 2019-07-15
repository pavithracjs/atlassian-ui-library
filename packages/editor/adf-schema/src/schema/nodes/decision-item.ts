import { Node, NodeSpec } from 'prosemirror-model';
import { Inline } from './doc';
import { DecisionListDefinition as DecisionList } from './decision-list';
import { uuid } from '../../utils/uuid';

export interface DecisionItemArray extends Array<Inline | DecisionList> {
  0: Inline;
}

/**
 * @name decisionItem_node
 */
export interface DecisionItemDefinition {
  type: 'decisionItem';
  /**
   * @minItems 1
   */
  content?: DecisionItemArray;
  attrs: {
    localId: string;
    state: string;
  };
}

export const decisionItem: NodeSpec = {
  content: '(inline | decisionList)*',
  defining: true,
  marks: '_',
  attrs: {
    localId: { default: '' },
    state: { default: 'DECIDED' },
  },
  parseDOM: [
    {
      tag: 'li[data-decision-local-id]',

      // Default priority is 50. We normally don't change this but since this node type is
      // also used by list-item we need to make sure that we run this parser first.
      priority: 100,

      getAttrs: dom => ({
        localId: uuid.generate(),
        state: (dom as HTMLElement).getAttribute('data-decision-state')!,
      }),
    },
  ],
  toDOM(node: Node) {
    const { localId, state } = node.attrs;
    const attrs = {
      'data-decision-local-id': localId || 'local-decision',
      'data-decision-state': state,
    };
    return ['li', attrs, 0];
  },
};
