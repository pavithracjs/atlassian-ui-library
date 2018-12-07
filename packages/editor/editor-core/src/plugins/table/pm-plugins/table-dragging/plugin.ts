import { EditorState, Plugin, PluginKey } from 'prosemirror-state';
import { EditorView, Decoration, DecorationSet } from 'prosemirror-view';
import {
  findParentNodeOfType,
  getCellsInColumn,
  getCellsInRow,
} from 'prosemirror-utils';

import { pluginKey as tablePluginKey } from '../main';
import { RowsColumnsDraggingPlugin, TableDecorations } from '../../types';

import {
  pluginKey as editorDisabledPluginKey,
  EditorDisabledPluginState,
} from '../../../editor-disabled';

import { Dispatch } from '../../../../event-dispatcher';

export const pluginKey = new PluginKey('tableRowsColsDragging');

export const createPlugin = (
  dispatch: Dispatch<DraggingState>,
  pluginConfig: RowsColumnsDraggingPlugin = {},
) =>
  new Plugin({
    key: pluginKey,
    state: {
      init: () => new DraggingState(),
      apply: (
        tr,
        pluginState: DraggingState,
        prevState,
        state: EditorState,
      ) => {
        const newPluginState = pluginState.apply(tr, pluginState, state);

        if (
          newPluginState &&
          (pluginState.index !== newPluginState.index ||
            pluginState.mode !== newPluginState.mode)
        ) {
          dispatch(pluginKey, newPluginState);
          return newPluginState;
        }

        return pluginState;
      },
    },
    view: () => ({
      update(view) {
        const { doc, selection, schema } = view.state;
        const table = findParentNodeOfType(schema.nodes.table)(selection);
      },
    }),
    props: {
      handleDOMEvents: {
        mousedown: (view: EditorView, event: MouseEvent) => {
          const {
            state: { selection },
          } = view;
          console.log({ mousedown: true, selection });
          return false;
        },
        mouseup: (view: EditorView, event: MouseEvent) => {
          console.log(`mouseup() ${Date.now()}`);
          return false;
        },
        mouseleave: (view: EditorView, event: MouseEvent) => {
          console.log(`mouseleave() ${Date.now()}`);
          return false;
        },
        mousemove: (view: EditorView, event: MouseEvent) => {
          console.log(`mousemove() ${Date.now()}`);
          return false;
        },
      },

      decorations(state) {
        const pluginState = pluginKey.getState(state);
        if (pluginState.index > -1) {
          return handleDecorations(state, pluginState);
        }
      },

      nodeViews: {},
    },
  });

export enum Mode {
  COLUMN = 'col',
  ROW = 'row',
}

export class DraggingState {
  constructor(
    public mode?: Mode,
    public index?: number,
    public dragging?: { startX: number; startY: number } | null,
  ) {
    return Object.freeze(this);
  }

  apply(tr, pluginState: DraggingState, state) {
    const { longPressEvent } = tablePluginKey.getState(state);
    const { editorDisabled } = editorDisabledPluginKey.getState(
      state,
    ) as EditorDisabledPluginState;

    // Disable dragging if editor is disabled, or content has changed, or long press ended
    if (
      editorDisabled ||
      (this.index && this.index > -1 && tr.docChanged) ||
      (!!pluginState.mode && !longPressEvent)
    ) {
      return new DraggingState();
    }

    if (longPressEvent && typeof longPressEvent.colIndex === 'number') {
      return new DraggingState(Mode.COLUMN, longPressEvent.colIndex, {
        startX: longPressEvent.clientX,
        startY: longPressEvent.clientY,
      });
    }

    if (longPressEvent && typeof longPressEvent.rowIndex === 'number') {
      return new DraggingState(Mode.ROW, longPressEvent.rowIndex, {
        startX: longPressEvent.clientX,
        startY: longPressEvent.clientY,
      });
    }

    return this;
  }
}

function handleDecorations(state, pluginState) {
  const { doc, selection } = state;
  const { mode, index } = pluginState;

  const draggableCells =
    (mode === Mode.COLUMN
      ? getCellsInColumn(index)(selection)
      : getCellsInRow(index)(selection)) || [];

  const draggableDecorations = draggableCells.map(({ pos, node }) =>
    Decoration.node(
      pos,
      pos + node.nodeSize,
      { class: 'draggable' },
      { key: TableDecorations.DRAG_MARK },
    ),
  );

  return DecorationSet.create(doc, draggableDecorations);
}

export const findControlsHoverDecoration = (
  decorationSet: DecorationSet,
): Decoration[] =>
  decorationSet.find(
    undefined,
    undefined,
    spec => spec.key === TableDecorations.DRAG_MARK,
  );
