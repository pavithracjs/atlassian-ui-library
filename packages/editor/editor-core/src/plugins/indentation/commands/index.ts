import { Node as PmNode, Schema } from 'prosemirror-model';
import { IndentationMarkAttributes } from '@atlaskit/adf-schema';
import { toggleBlockMark } from '../../../commands';
import { Command } from '../../../types/command';
import { addAnalytics, AnalyticsEventPayload } from '../../analytics';
import { Transaction } from 'prosemirror-state';
import {
  createAnalyticsChangesStorage,
  getPrevIndentLevel,
  getNewIdentLevel,
  createAnalyticsDispatch,
} from './utils';

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

function createIndentationCommandWithAnalytics(
  getNewIdentationAttrs: (
    prevAttrs?: IndentationMarkAttributes,
    node?: PmNode,
  ) => IndentationMarkAttributes | undefined | false,
  direction: 'indent' | 'outdent',
): Command {
  const storage = createAnalyticsChangesStorage(
    getNewIdentationAttrs,
    direction,
  );

  const identationCommand = createIndentationCommand(storage.handler);

  return (state, dispatch) => {
    return identationCommand(state, createAnalyticsDispatch(storage, dispatch));
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
  'indent',
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

export const outdent: Command = createIndentationCommandWithAnalytics(
  getOutdentAttributes,
  'outdent',
);

export const removeIndentation: Command = (state, dispatch) =>
  toggleBlockMark(state.schema.marks.indentation, () => false)(state, dispatch);
