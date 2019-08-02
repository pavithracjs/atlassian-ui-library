import { Node as PMNode, Mark } from 'prosemirror-model';
import {
  StatusDefinition,
  DateDefinition,
  MentionAttributes,
} from '@atlaskit/adf-schema';

interface NodeMetaGenerator<Type, Value> {
  type: Type;
  value: Value;
}
type TextNodeMeta = NodeMetaGenerator<'text', string>;
type NodeMeta =
  | TextNodeMeta
  | NodeMetaGenerator<'number', number>
  | NodeMetaGenerator<'status', string>
  | NodeMetaGenerator<'date', number>
  | NodeMetaGenerator<'mention', string>
  | NodeMetaGenerator<'link', string>;

function getLinkMark(node: PMNode): Mark | null {
  const [linkMark] = node.marks.filter(mark => mark.type.name === 'link');
  return linkMark || null;
}

function getMetaFromNode(node: PMNode): NodeMeta | null {
  const firstChild = node.firstChild;
  if (!firstChild) {
    return null;
  }

  switch (firstChild.type.name) {
    // Text case
    case 'paragraph': {
      return getMetaFromNode(firstChild);
    }
    case 'text': {
      // treat as a link if contain a link
      const linkMark = getLinkMark(firstChild);
      if (linkMark) {
        const value = firstChild.text || '';
        return {
          type: 'link',
          value,
        };
      }

      const text = firstChild.text || '';
      const firstEmptySpace = text.indexOf(' ');
      const firstWord =
        firstEmptySpace !== -1 ? text.substring(0, firstEmptySpace) : text;
      const maybeANumber = Number.parseFloat(firstWord);
      if (!Number.isNaN(maybeANumber)) {
        return {
          type: 'number',
          value: maybeANumber,
        };
      }
      return {
        type: 'text',
        value: firstWord,
      };
    }
    case 'status': {
      const text = (firstChild.attrs as StatusDefinition['attrs']).text;
      return {
        type: 'status',
        value: text,
      };
    }
    case 'date': {
      const timestamp = Number.parseInt(
        (firstChild.attrs as DateDefinition['attrs']).timestamp,
        20,
      );
      return {
        type: 'date',
        value: timestamp,
      };
    }
    case 'mention': {
      // TODO: Check what should be the fallback when mention does not have a text
      const text = (firstChild.attrs as MentionAttributes).text || '';
      return {
        type: 'mention',
        value: text,
      };
    }
    default:
      return null;
  }
}

function compareValue(
  valueA: string | number,
  valueB: string | number,
): 1 | 0 | -1 {
  if (valueA === valueB) {
    return 0;
  }

  return valueA > valueB ? 1 : -1;
}

/**
 * Compare 2 prosemirror nodes and check if it's greater, equal or less than the other node
 *
 * @param {Node} nodeA
 * @param {Node} nodeB
 * @returns {(1 | 0 | -1)}
 *    1  -> NodeA > NodeB
 *    0  -> NodeA === NodeB
 *    -1 -> Node A < NodeB
 */
export const compareNodes = (
  nodeA: PMNode | null,
  nodeB: PMNode | null,
): number => {
  if (nodeA === null || nodeB === null) {
    return nodeB === null ? 1 : -1;
  }

  const metaNodeA = getMetaFromNode(nodeA);
  const metaNodeB = getMetaFromNode(nodeB);
  if (metaNodeA === metaNodeB) {
    return 0;
  }
  if (metaNodeA === null || metaNodeB === null) {
    return metaNodeB === null ? 1 : -1;
  }

  return compareValue(metaNodeA.value, metaNodeB.value);
};
