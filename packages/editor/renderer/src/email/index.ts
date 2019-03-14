import { fontFamily, fontSize } from '@atlaskit/theme';

import { Fragment, Node as PMNode, Schema } from 'prosemirror-model';

import { Serializer } from '../serializer';
import { nodeSerializers } from './serializers';
import { serializeStyle } from './util';
import { calcTableColumnWidths } from '@atlaskit/adf-schema';
import { PMNodeParent } from './interfaces';

const serializeNode = (
  node: PMNode,
  serializedHTML?: string,
  parents: PMNodeParent[] = [],
): string => {
  // ignore nodes with unknown type
  if (!nodeSerializers[node.type.name]) {
    return `[UNKNOWN_NODE_TYPE: ${node.type.name}]`;
  }

  console.log(node.type.name);
  console.log(parents);

  const attrs = node.type.name === 'table' ? getTableAttrs(node) : node.attrs;

  return nodeSerializers[node.type.name]({
    attrs,
    marks: node.marks,
    text:
      serializedHTML || node.attrs.text || node.attrs.shortName || node.text,
  });
};

const getTableAttrs = (node: PMNode): any => {
  return {
    ...node.attrs,
    columnWidths: calcTableColumnWidths(node),
  };
};

const traverseTree = (
  fragment: Fragment,
  parents: PMNodeParent[] = [],
): string => {
  let output = '';

  fragment.forEach(childNode => {
    if (childNode.isLeaf) {
      output += serializeNode(childNode, undefined, parents);
    } else {
      const innerHTML = traverseTree(childNode.content, [
        ...parents,
        { name: childNode.type.name },
      ]);
      output += serializeNode(childNode, innerHTML, parents);
    }
  });

  return output;
};

export const commonStyle = {
  'font-family': fontFamily(),
  'font-size': fontSize(),
  'font-weight': 400,
  'line-height': '24px',
};

const wrapperCSS = serializeStyle(commonStyle);

export default class EmailSerializer implements Serializer<string> {
  serializeFragment(fragment: Fragment): string {
    const innerHTML = traverseTree(fragment);
    return `<div style="${wrapperCSS}">${innerHTML}</div>`;
  }

  static fromSchema(schema: Schema): EmailSerializer {
    return new EmailSerializer();
  }
}
