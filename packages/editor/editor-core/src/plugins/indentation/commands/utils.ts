import { IndentationMarkAttributes } from '../../../../../adf-schema';
import { Node } from 'prosemirror-model';
import { addAnalytics } from '../../analytics';
import { Transaction } from 'prosemirror-state';

// Analytics GAS v3 Utils

function getIndentType(node: Node): 'paragraph' | 'heading' | undefined {
  switch (node.type.name) {
    case 'paragraph':
    case 'heading':
      return node.type.name;
    default:
      return undefined;
  }
}

/**
 * Get the current identation level given prev and new attributes
 * @param prevAttrs - Previous attributes from indentation
 * @param newAttrs - New attributes from identation
 */
export function getNewIdentLevel(
  prevAttrs: IndentationMarkAttributes | undefined,
  newAttrs: IndentationMarkAttributes | undefined | false,
): number {
  if (newAttrs === undefined) {
    return prevAttrs!.level;
  } else if (newAttrs === false) {
    return 0;
  }
  return newAttrs.level;
}

/**
 * Get the previous identation level  prev attributes
 * @param prevAttrs - Previous attributes from indentation
 */
export function getPrevIndentLevel(
  prevAttrs: IndentationMarkAttributes | undefined,
): number {
  if (prevAttrs === undefined) {
    return 0;
  }
  return prevAttrs.level;
}

interface IdentationChanges {
  node: Node;
  prevAttrs: IndentationMarkAttributes | undefined;
  newAttrs: IndentationMarkAttributes | undefined | false;
  direction: 'indent' | 'outdent';
}

interface StorageChanges {
  handler(
    prevAttrs?: IndentationMarkAttributes,
    node?: Node,
  ): IndentationMarkAttributes | undefined | false;
  getChanges(): IdentationChanges[];
}

/**
 * Create an storage to store the changes from prev and new attributes
 *
 * @param getNewIdentationAttrs - Function who gets the new attribiutes
 */
export function createAnalyticsChangesStorage(
  getNewIdentationAttrs: (
    prevAttrs?: IndentationMarkAttributes,
    node?: Node,
  ) => IndentationMarkAttributes | undefined | false,
  direction: 'indent' | 'outdent',
): StorageChanges {
  let changes: IdentationChanges[] = [];

  function getNewIdentationAttrsWithChangeRecorder(
    prevAttrs?: IndentationMarkAttributes,
    node?: Node,
  ): IndentationMarkAttributes | undefined | false {
    const newAttrs = getNewIdentationAttrs(prevAttrs, node);

    changes.push({
      node: node!,
      prevAttrs,
      newAttrs,
      direction,
    });

    return newAttrs;
  }

  return {
    handler: getNewIdentationAttrsWithChangeRecorder,
    getChanges() {
      const oldChanges = changes;
      changes = [];
      return oldChanges;
    },
  };
}

/**
 * Create a new dispatch function who add analytcs events given an storage
 *
 * @export
 * @param {*} storage
 * @returns
 */
export function createAnalyticsDispatch(
  storage: StorageChanges,
  dispatch?: (tr: Transaction) => void,
): (tr: Transaction) => void {
  return (tr: Transaction) => {
    let currentTr = tr;
    storage.getChanges().forEach(({ node, prevAttrs, newAttrs, direction }) => {
      const indentType = getIndentType(node);
      if (!indentType) {
        return; // If no valid indent type continue
      }

      currentTr = addAnalytics(currentTr, {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'indentation',
        eventType: 'track',
        attributes: {
          inputMethod: 'keyboard',
          previousIndentationLevel: getPrevIndentLevel(prevAttrs),
          newIndentLevel: getNewIdentLevel(prevAttrs, newAttrs),
          direction,
          indentType,
        },
      });
    });

    if (dispatch) {
      dispatch(tr);
    }
  };
}
