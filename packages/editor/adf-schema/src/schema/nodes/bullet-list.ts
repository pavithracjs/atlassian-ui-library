import { NodeSpec } from 'prosemirror-model';
import { MarksObject, NoMark } from './doc';
import { ListItemDefinition as ListItemNode } from './list-item';
import { IndentationMarkDefinition } from '../marks';

/**
 * @name bulletList_node
 */
export interface BulletListBaseDefinition {
  type: 'bulletList';
  /**
   * @minItems 1
   */
  content: Array<ListItemNode>;
  marks?: Array<any>;
}

/**
 * @name bulletList_with_no_marks_node
 */
export type BulletListDefinition = BulletListBaseDefinition & NoMark;

/**
 * @name bulletList_with_marks_node
 * @stage 0
 */
export type BulletListWithMarksDefinition = BulletListBaseDefinition &
  MarksObject<IndentationMarkDefinition>;

export const bulletList: NodeSpec = {
  group: 'block',
  content: 'listItem+',
  parseDOM: [{ tag: 'ul' }],
  toDOM() {
    return ['ul', 0];
  },
};
