import { Node, NodeSpec } from 'prosemirror-model';
import { Inline } from './doc';
import { TaskListDefinition as TaskList } from './task-list';
import { uuid } from '../../utils/uuid';

export interface TaskItemArray extends Array<Inline | TaskList> {
  0: Inline;
}

/**
 * @name taskItem_node
 */
export interface TaskItemDefinition {
  type: 'taskItem';
  /**
   * @minItems 1
   */
  content?: TaskItemArray;
  attrs: {
    localId: string;
    state: 'TODO' | 'DONE';
  };
}

export const taskItem: NodeSpec = {
  content: '(inline | taskList)*',
  defining: true,
  marks: '_',
  attrs: {
    localId: { default: '' },
    state: { default: 'TODO' },
  },
  parseDOM: [
    {
      tag: 'li[data-task-local-id]',

      // Default priority is 50. We normally don't change this but since this node type is
      // also used by list-item we need to make sure that we run this parser first.
      priority: 100,

      getAttrs: dom => ({
        localId: uuid.generate(),
        state: (dom as HTMLElement).getAttribute('data-task-state') || 'TODO',
      }),
    },
  ],
  toDOM(node: Node) {
    const { localId, state } = node.attrs;
    const attrs = {
      'data-task-local-id': localId || 'local-task',
      'data-task-state': state || 'TODO',
    };
    return ['li', attrs, 0];
  },
};
