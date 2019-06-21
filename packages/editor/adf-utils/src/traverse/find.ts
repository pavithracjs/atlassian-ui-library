import { ADFEntity } from '../types';

export function find(
  adf: ADFEntity,
  callback: (node: ADFEntity) => boolean,
): ADFEntity | undefined {
  return checkNode(adf, callback);
}

function checkNode(
  adfNode: ADFEntity,
  callback: (node: ADFEntity) => boolean,
): ADFEntity | undefined {
  const newNode = { ...adfNode };

  if (callback({ ...newNode })) {
    return newNode;
  }

  if (newNode.content) {
    return newNode.content.find(node => !!checkNode(node, callback));
  }

  return;
}
