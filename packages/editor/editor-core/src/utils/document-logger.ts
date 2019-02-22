import { Node as PMNode, Fragment } from 'prosemirror-model';

const messageWidth = 80;

export const logDocument = (doc: PMNode): string => {
  try {
    return `${repeatChar('-', messageWidth)}\n${logBlockNode(doc, 0, 0)}`;
  } catch (error) {
    return `Error logging document structure: ${error}`;
  }
};

const logBlockNode = (node: PMNode, pos: number, indentAmt: number): string => {
  const indent = repeatChar(' ', indentAmt);
  const separator = repeatChar('-', messageWidth - indentAmt * 2);

  let nodeText = `${indent}|${pos}| ${node.type.name}${logMarks(node)} `;
  const endPosText = `|${pos + node.nodeSize - 1}|`;
  const spacing = repeatChar(
    ' ',
    messageWidth - nodeText.length - endPosText.length - indentAmt,
  );
  nodeText = `${nodeText}${spacing}${endPosText}`;
  const content = logBlockNodeContent(node.content, pos, indentAmt);

  return `${nodeText}\n${indent}${separator}\n${content}`;
};

const logBlockNodeContent = (
  node: Fragment & { content?: PMNode[] },
  pos: number,
  indentAmt: number,
): string => {
  let blockNodeContent = '';
  if (!node || !node.content || !node.content.length) {
    return blockNodeContent;
  }

  const { content } = node;
  if (content[0].isBlock) {
    // children are block nodes
    let prevNode;
    content.forEach(node => {
      pos += prevNode ? prevNode.nodeSize : 1;
      blockNodeContent += logBlockNode(node, pos, indentAmt + 1);
      prevNode = node;
    });
  } else {
    // children are inline nodes
    const result = logInlineNodes(content, pos, indentAmt);
    blockNodeContent += result.inlineNodes;
    pos = result.pos;
  }

  return blockNodeContent;
};

const logInlineNodes = (
  nodes: PMNode[],
  pos: number,
  indentAmt: number,
): { inlineNodes: string; pos: number } => {
  let inlineNodes = '';
  indentAmt += 1;

  // initially just join all inline nodes together on one line separated by their positions
  nodes.forEach(node => {
    inlineNodes += `|${pos}| ${node.type.name}${logMarks(node)} `;
    pos += node.nodeSize;
  });
  inlineNodes += `|${pos}|`;

  const diff = messageWidth - inlineNodes.length - indentAmt * 2;
  if (diff > 0) {
    // line is too short, add some spacing
    inlineNodes = distributeNodes(inlineNodes, indentAmt);
  } else if (diff < 0) {
    // line is too long, need to wrap it
    inlineNodes = wrapNodes(inlineNodes, indentAmt);
  } else {
    // line is just right, fits perfectly
    inlineNodes += `${inlineNodes}\n`;
  }
  return { inlineNodes, pos };
};

const logMarks = (node: PMNode): string => {
  if (node.marks.length === 0) {
    return '';
  }
  return ` {${node.marks.reduce((marks, mark) => {
    let markString = marks;
    if (marks.length > 0) {
      markString += ', ';
    }
    markString += mark.type.name;
    return markString;
  }, '')}}`;
};

const repeatChar = (char: string, amount: number): string =>
  Array(amount)
    .fill(char)
    .join('');

/** Split line of pipe-separated nodes into individual nodes */
const splitNodeLine = (nodeLine: string): string[] =>
  nodeLine
    .split(/(\|[0-9]+\| [a-zA-Z]+(?: \{[a-zA-Z\,\s]+\})? \|[0-9]+\|)/)
    .filter(s => !!s);

/**
 * Add spacing inside each node so that the line reaches the message width (minus indentation)
 */
const distributeNodes = (nodeLine: string, indentAmt: number): string => {
  let line = '';
  const diff = messageWidth - nodeLine.length - indentAmt * 2;
  const indent = repeatChar(' ', indentAmt);
  const nodes = splitNodeLine(nodeLine);
  let paddingAmt = Math.floor(diff / nodes.length);

  nodes.forEach((node, idx) => {
    if (idx === nodes.length - 1) {
      paddingAmt += diff % nodes.length;
    }
    const nodePadding = repeatChar(' ', paddingAmt);
    line += node.replace(
      / [a-zA-Z]+( \{[a-zA-Z\,\s]+\})? /,
      `$&${nodePadding}`,
    );
  });

  return `${indent}${line}\n${indent}${repeatChar('-', line.length)}\n`;
};

/**
 * Wraps nodes over multiple lines when they exceed the message width
 */
const wrapNodes = (nodeLine: string, indentAmt: number): string => {
  const nodes = splitNodeLine(nodeLine);

  // find the point at which we should break the line
  let breakIdx = nodes.length - 1;
  let totalChars = 0;
  nodes.every((node, idx) => {
    breakIdx = Math.max(0, idx - 2);
    totalChars += node.length;
    return !(totalChars > messageWidth - indentAmt * 2);
  });

  let lines = [
    nodes.slice(0, breakIdx).join(''),
    nodes.slice(breakIdx).join(''),
  ];

  // make sure both the first line ends with and the second line starts
  // with the position number
  const endNumber = /\|[0-9]+\|$/.exec(lines[0].trim());
  const startNumber = /^\|[0-9]+\|/.exec(lines[1].trim());
  if (!endNumber && startNumber) {
    lines[0] += startNumber[0];
  } else if (!startNumber && endNumber) {
    lines[1] = `${endNumber}${lines[1]}`;
  }

  // we may need to wrap over more than 2 lines
  while (lines[lines.length - 1].length > messageWidth) {
    lines = [...lines, ...wrapNodes(lines[lines.length - 1], indentAmt)];
  }

  return lines.map(line => distributeNodes(line, indentAmt)).join('');
};
