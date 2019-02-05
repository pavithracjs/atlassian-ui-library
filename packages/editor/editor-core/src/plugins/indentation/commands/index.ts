import { Node as PmNode, Schema } from 'prosemirror-model';
import { IndentationMarkAttributes } from '@atlaskit/adf-schema';
import { toggleBlockMark } from '../../../commands';
import { Command } from '../../../types/command';
import { addAnalytics, AnalyticsEventPayload } from '../../analytics';
import { Transaction } from 'prosemirror-state';

const MAX_INDENTATION_LEVEL = 6;

const isIndentationAllowed = (schema: Schema, node: PmNode, parent: PmNode) => {
  const {
    nodes: { paragraph, heading },
    marks: { alignment },
  } = schema;

  if ([paragraph, heading].indexOf(node.type) > -1) {
    if (alignment) {
      const hasAlignment = node.marks.filter(
        mark => mark.type === alignment,
      )[0];
      return !hasAlignment;
    }
    return true;
  }
  return false;
};

/**
 * Create new indentation command (Either indent or outdent depend of getArgsFn)
 * @param getNewIdentationAttrs Function to handle new indentation level
 */
function createIndentationCommand(
  getNewIdentationAttrs: (
    prevArgs?: IndentationMarkAttributes,
    node?: PmNode,
  ) => IndentationMarkAttributes | undefined | false,
): Command {
  return (state, dispatch) => {
    const { indentation } = state.schema.marks;

    return toggleBlockMark<IndentationMarkAttributes>(
      indentation,
      getNewIdentationAttrs,
      isIndentationAllowed,
    )(state, dispatch);
  };
}

// Utils function to get analytcs payload values
function getNewIdentLevel(
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

function getPrevIndentLevel(
  prevAttrs: IndentationMarkAttributes | undefined,
): number {
  if (prevAttrs === undefined) {
    return 0;
  }
  return prevAttrs.level;
}

type IdentationChanges = {
  node: PmNode;
  prevAttrs: IndentationMarkAttributes | undefined;
  newAttrs: IndentationMarkAttributes | undefined | false;
};

/**
 * Get new identation attributes wrapper to store the changes
 *
 * @param {IndentationMarkAttributes} [prevAttrs]
 * @param {PmNode} [node]
 * @returns {(IndentationMarkAttributes | undefined | false)}
 */
function createAnalyticsChangeStorage(
  getNewIdentationAttrs: (
    prevAttrs?: IndentationMarkAttributes,
    node?: PmNode,
  ) => IndentationMarkAttributes | undefined | false,
) {
  const changes: IdentationChanges[] = [];

  function getNewIdentationAttrsWithChangeRecorder(
    prevAttrs?: IndentationMarkAttributes,
    node?: PmNode,
  ): IndentationMarkAttributes | undefined | false {
    const newAttrs = getNewIdentationAttrs(prevAttrs, node);

    changes.push({
      node: node!,
      prevAttrs,
      newAttrs,
    });

    return newAttrs;
  }

  return {
    handler: getNewIdentationAttrsWithChangeRecorder,
    forEach: changes.forEach.bind(changes),
  };
}

function createIndentationCommandWithAnalytics(
  getNewIdentationAttrs: (
    prevAttrs?: IndentationMarkAttributes,
    node?: PmNode,
  ) => IndentationMarkAttributes | undefined | false,
) {
  const storage = createAnalyticsChangeStorage(getNewIdentationAttrs);

  const dispatchAnalytics = dispatch => (tr: Transaction) => {
    storage.forEach(({ node, prevAttrs, newAttrs }) =>
      addAnalytics(tr, {
        action: 'formatted',
        actionSubject: 'text',
        actionSubjectId: 'indentation',
        eventType: 'track',
        attributes: {
          inputMethod: 'keyboard',
          direction: 'indent', //'indent' | 'outdent'
          previousIndentationLevel: getPrevIndentLevel(prevAttrs),
          newIndentLevel: getNewIdentLevel(prevAttrs, newAttrs),
          indentType: node.type.name, //'paragraph' | 'list' | 'heading' | 'codeBlock'
        },
      } as AnalyticsEventPayload),
    );
    return dispatch(tr);
  };

  const identationCommand = createIndentationCommand(storage.handler);

  return (state, dispatch) => {
    return identationCommand(state, dispatchAnalytics(dispatch));
  };
}

/**
 * Get new level for outdent
 * @param oldAttr Old attributes for the mark, undefined if the mark doesnt exit
 * @returns  - undefined; No change required
 *           - false; Remove the mark
 *           - object; Update attributes
 */
const getIndentAttributes = (
  oldAttr?: IndentationMarkAttributes,
): IndentationMarkAttributes | undefined => {
  if (!oldAttr) {
    return { level: 1 }; // No mark exist, create a new one with level 1
  }

  const { level } = oldAttr;
  if (level >= MAX_INDENTATION_LEVEL) {
    return undefined; // Max indentation level reached, do nothing.
  }
  return { level: level + 1 }; // Otherwise, increase the level by one
};

export const indent: Command = createIndentationCommandWithAnalytics(
  getIndentAttributes,
);

/**
 * Get new level for outdent
 * @param oldAttr Old attributes for the mark, undefined if the mark doesnt exit
 * @returns  - undefined; No change required
 *           - false; Remove the mark
 *           - object; Update attributes
 */
const getOutdentAttributes = (
  oldAttr?: IndentationMarkAttributes,
): IndentationMarkAttributes | undefined | false => {
  if (!oldAttr) {
    return undefined; // Do nothing;
  }

  const { level } = oldAttr;
  if (level <= 1) {
    return false; // Remove the mark
  }

  return { level: level - 1 }; // Decrese the level on other cases
};

export const outdent: Command = createIndentationCommand(getOutdentAttributes);

export const removeIndentation: Command = (state, dispatch) =>
  toggleBlockMark(state.schema.marks.indentation, () => false)(state, dispatch);
