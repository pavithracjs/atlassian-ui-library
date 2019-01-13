import * as React from 'react';
import {
  EditorState,
  Plugin,
  PluginKey,
  Transaction,
  NodeSelection,
  Selection,
} from 'prosemirror-state';
import { Node as PMNode, Fragment } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  isCellSelection,
  findParentNodeOfTypeClosestToPos,
  getCellsInColumn,
  findDomRefAtPos,
  findCellClosestToPos,
  findTable,
} from 'prosemirror-utils';
import EditorTextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';
import EditorMentionIcon from '@atlaskit/icon/glyph/editor/mention';
import EditorTaskIcon from '@atlaskit/icon/glyph/editor/task';
import EditorEmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import { CellType } from '@atlaskit/adf-schema';

import DateIcon from '../icons/Date';
import Number from '../icons/Number';
import Slider from '../icons/Slider';
import Currency from '../icons/Currency';

import { pluginKey as datePluginKey } from '../../date/plugin';
import { Cell, TableCssClassName as ClassName } from '../types';
import { Dispatch } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Command } from '../../../types';
import { pluginKey as tablePluginKey } from './main';
import { sliderNodeViewFactory } from '../nodeviews/slider';

export const pluginKey = new PluginKey('tableColumnTypesPlugin');

export interface PluginState {
  // clicked cell needed to position cellType dropdowns (date, emoji, mention, link)
  clickedCell?: Cell;
  // index of the column where column types menu button was clicked
  columnIndex?: number;
  isMenuOpen?: boolean;
  selectMenuType?: CellType;
}

export const createColumnTypesPlugin = (
  dispatch: Dispatch,
  portalProviderAPI: PortalProviderAPI,
) =>
  new Plugin({
    key: pluginKey,

    state: {
      init: (): PluginState => ({
        clickedCell: undefined,
      }),
      apply(tr: Transaction, _pluginState: PluginState, _, state: EditorState) {
        let pluginState = { ..._pluginState };

        if (tr.docChanged && pluginState.clickedCell) {
          const { pos, deleted } = tr.mapping.mapResult(
            pluginState.clickedCell.pos,
          );
          pluginState = {
            ...pluginState,
            clickedCell: deleted
              ? undefined
              : findCellClosestToPos(tr.doc.resolve(pos)),
          };
          dispatch(pluginKey, pluginState);
        }

        const meta = tr.getMeta(pluginKey) as PluginState | undefined;
        if (meta !== undefined) {
          const nextState = {
            ...pluginState,
            ...meta,
          };
          dispatch(pluginKey, nextState);
          return nextState;
        }

        return pluginState;
      },
    },

    props: {
      nodeViews: {
        slider: sliderNodeViewFactory(portalProviderAPI),
      },

      handleDOMEvents: {
        mousedown(view: EditorView, event) {
          const { state, dispatch } = view;
          const { tableRef } = tablePluginKey.getState(state);
          const posAtCoords = view.posAtCoords({
            left: (event as MouseEvent).clientX,
            top: (event as MouseEvent).clientY,
          });
          if (
            !tableRef ||
            isCellSelection(view.state.selection) ||
            !posAtCoords
          ) {
            return setClickedCell(undefined)(state, dispatch);
          }
          const $pos = state.doc.resolve(posAtCoords.pos);
          const cell = findParentNodeOfTypeClosestToPos($pos, [
            state.schema.nodes.tableCell,
          ]);
          if (
            !cell ||
            [
              'date',
              'mention',
              'checkbox',
              'emoji',
              'slider',
              'person',
            ].indexOf(cell.node.attrs.cellType) === -1
          ) {
            return setClickedCell(undefined)(state, dispatch);
          }
          event.preventDefault();
          return setClickedCell(cell)(state, dispatch);
        },
      },
    },
  });

export const setClickedCell = (clickedCell?: Cell): Command => (
  state,
  dispatch,
): boolean => {
  const pluginState = pluginKey.getState(state);
  if (
    pluginState.clickedCell === clickedCell ||
    (clickedCell && clickedCell.node.type === state.schema.nodes.tableHeader)
  ) {
    return false;
  }
  let { tr } = state;
  tr.setMeta(pluginKey, {
    ...pluginState,
    clickedCell,
  });

  // insert mention on click on cellType="mention"
  if (clickedCell && clickedCell.node.attrs.cellType === 'mention') {
    const mark = state.schema.mark('typeAheadQuery', {
      trigger: '@',
    });
    const query = state.schema.text('@', [mark]);
    tr = setCellContent(query, clickedCell)(tr);
  }

  // insert emoji on click on cellType="emoji"
  if (clickedCell && clickedCell.node.attrs.cellType === 'emoji') {
    const mark = state.schema.mark('emojiQuery');
    const query = state.schema.text(':', [mark]);
    tr = setCellContent(query, clickedCell)(tr);
  }

  // cellType="date"
  if (clickedCell && clickedCell.node.attrs.cellType === 'date') {
    // insert today's date if cell is empty
    if (clickedCell.node.nodeSize === 4) {
      const currentDate = new Date();
      const timestamp = Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
      ).toString();
      const node = state.schema.nodes.date.createChecked({ timestamp });
      tr = setCellContent(node, clickedCell)(tr);
    }
    tr.setSelection(NodeSelection.create(tr.doc, clickedCell.pos + 1)).setMeta(
      datePluginKey,
      { showDatePickerAt: clickedCell.pos + 2 },
    );
  }

  if (clickedCell && clickedCell.node.attrs.cellType === 'checkbox') {
    if (clickedCell.node.nodeSize === 4) {
      const query = state.schema.text('✅');
      tr = setCellContent(query, clickedCell)(tr);
    } else {
      tr = setCellContent([], clickedCell)(tr);
    }
  }

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

export const setCellContent = (nodes: PMNode | PMNode[], clickedCell: Cell) => (
  tr: Transaction,
) => {
  const { pos, start } = clickedCell;
  const { paragraph } = clickedCell.node.type.schema.nodes;
  const content = Fragment.from(nodes);
  const newCell = clickedCell.node.type.create(
    clickedCell.node.attrs,
    paragraph.create({}, content, clickedCell.node.content.firstChild!.marks),
  );

  return tr
    .replaceWith(pos, pos + clickedCell.node.nodeSize, newCell)
    .setSelection(Selection.near(tr.doc.resolve(start + content.size + 1)));
};

export const getColumnTypesButtonRef = (columnIndex: number) => (
  view: EditorView,
): HTMLElement | undefined => {
  const { state } = view;
  const table = findTable(state.selection);
  if (!table) {
    return;
  }

  const cells = getCellsInColumn(columnIndex)(state.selection);
  if (cells) {
    const firstCell = cells[0];
    const { tableHeader } = state.schema.nodes;
    if (firstCell && firstCell.node.type === tableHeader) {
      const domAtPos = view.domAtPos.bind(view);
      const cellRef = findDomRefAtPos(cells[0].pos, domAtPos) as HTMLElement;
      if (cellRef) {
        return cellRef.querySelector(
          `.${ClassName.CELL_NODEVIEW_COLUMN_TYPES_BUTTON}`,
        ) as HTMLElement;
      }
    }
  }
};

export const setColumnType = (
  columnIndex: number,
  cellType: CellType,
  content: PMNode,
): Command => (state, dispatch) => {
  const cells = getCellsInColumn(columnIndex)(state.selection);
  if (!cells) {
    return false;
  }
  const { tr, schema } = state;
  const { tableHeader, paragraph } = state.schema.nodes;

  cells.forEach((cell, index) => {
    let cellContent;
    if (cell.node.type === tableHeader) {
      cellContent = paragraph.createAndFill();
    } else if (
      (cellType === 'number' || cellType === 'currency') &&
      cell.node.child(0).type.name === 'paragraph' &&
      `${parseInt(cell.node.textContent, 10)}` === cell.node.textContent
    ) {
      cellContent = cell.node.content;
    } else {
      cellContent = content;
    }

    const { alignment } = schema.marks;

    let newMark;
    if (cellType === 'number' || cellType === 'currency') {
      newMark = alignment.create({ align: 'end' });
    } else if (cellType === 'checkbox') {
      newMark = alignment.create({ align: 'center' });
    }

    const newContent = cellContent.type.createChecked(
      cellContent.attrs,
      cellContent.content,
      cellContent.marks
        .filter(mark => !alignment.excludes(mark.type))
        .concat(newMark ? [newMark] : []),
    );

    const newCell = cell.node.type.create(
      { ...cell.node.attrs, cellType },
      newContent,
    );

    tr.replaceWith(
      tr.mapping.map(cell.pos),
      tr.mapping.map(cell.pos + cell.node.nodeSize),
      newCell,
    );
  });

  if (cells[1]) {
    const newSelection = Selection.findFrom(
      tr.doc.resolve(tr.mapping.map(cells[1].pos)),
      1,
      true,
    );
    if (newSelection) {
      tr.setSelection(newSelection);
    }
  }

  if (dispatch) {
    dispatch(tr);
  }

  return true;
};

export const getCellTypeIcon = (cellType: string) => {
  switch (cellType) {
    case 'text':
      return <EditorTextStyleIcon label="Normal text" />;
    case 'number':
      return <Number label="Number" />;
    case 'currency':
      return <Currency label="Currency" />;
    case 'date':
      return <DateIcon label="Date" />;
    case 'mention':
      return <EditorMentionIcon label="Person" />;
    case 'checkbox':
      return <EditorTaskIcon label="Checkbox" />;
    case 'slider':
      return <Slider label="Slider" />;
    case 'emoji':
      return <EditorEmojiIcon label="Emoji" />;
    case 'decision':
      return <DecisionIcon label="Decision" />;
    default:
      return <EditorTextStyleIcon label="Normal text" />;
  }
};
