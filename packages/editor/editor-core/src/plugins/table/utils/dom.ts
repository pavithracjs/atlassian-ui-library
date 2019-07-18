import { TableCssClassName as ClassName } from '../types';
import { closestElement } from '../../../utils';

export const isInsertColumnButton = (node: HTMLElement) => {
  const cl = node.classList;
  return (
    cl.contains(ClassName.CONTROLS_INSERT_COLUMN) ||
    closestElement(node, `.${ClassName.CONTROLS_INSERT_COLUMN}`) ||
    (cl.contains(ClassName.CONTROLS_BUTTON_OVERLAY) &&
      closestElement(node, `.${ClassName.COLUMN_CONTROLS}`))
  );
};

export const isCell = (node: HTMLElement): boolean => {
  return node && ['TH', 'TD'].indexOf(node.tagName) > -1;
};

export const isInsertRowButton = (node: HTMLElement) => {
  const cl = node.classList;
  return (
    cl.contains(ClassName.CONTROLS_INSERT_ROW) ||
    closestElement(node, `.${ClassName.CONTROLS_INSERT_ROW}`) ||
    (cl.contains(ClassName.CONTROLS_BUTTON_OVERLAY) &&
      closestElement(node, `.${ClassName.ROW_CONTROLS}`))
  );
};

export const getColumnOrRowIndex = (target: HTMLElement): [number, number] => [
  parseInt(target.getAttribute('data-start-index') || '-1', 10),
  parseInt(target.getAttribute('data-end-index') || '-1', 10),
];

export const getMousePositionHorizontalRelativeByElement = (
  mouseEvent: MouseEvent,
): 'left' | 'right' | null => {
  const element = mouseEvent.target;
  if (element instanceof HTMLElement) {
    const elementRect = element.getBoundingClientRect();
    if (elementRect.width <= 0) {
      return null;
    }

    const x = mouseEvent.clientX - elementRect.left;
    return x / elementRect.width > 0.5 ? 'right' : 'left';
  }

  return null;
};

export const getMousePositionVerticalRelativeByElement = (
  mouseEvent: MouseEvent,
): 'top' | 'bottom' | null => {
  const element = mouseEvent.target;
  if (element instanceof HTMLElement) {
    const elementRect = element.getBoundingClientRect();
    if (elementRect.height <= 0) {
      return null;
    }

    const y = mouseEvent.clientY - elementRect.top;
    return y / elementRect.height > 0.5 ? 'bottom' : 'top';
  }

  return null;
};
