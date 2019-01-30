import { NodeSpec } from 'prosemirror-model';
import { MarksObject, NoMark } from './doc';
import { ListItemDefinition as ListItemNode } from './list-item';
import { IndentationMarkDefinition } from '../marks';

/**
 * @name orderedList_node
 */
export interface OrderedListBaseDefinition {
  type: 'orderedList';
  /**
   * @minItems 1
   */
  content: Array<ListItemNode>;
  attrs?: {
    /**
     * @minimum 1
     */
    order: number;
  };
}

/**
 * @name orderedList_with_no_marks_node
 */
export type OrderedListDefinition = OrderedListBaseDefinition & NoMark;

/**
 * @name orderedList_with_marks_node
 * @stage 0
 */
export type OrderedListWithMarksDefinition = OrderedListBaseDefinition &
  MarksObject<IndentationMarkDefinition>;

export const orderedList: NodeSpec = {
  group: 'block',
  content: 'listItem+',
  parseDOM: [{ tag: 'ol' }],
  toDOM() {
    return ['ol', 0];
  },
};
