import { Decoration, DecorationSet } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import {
  TableCssClassName as ClassName,
  TableDecorations,
  Cell,
} from '../types';
import { getPluginState } from '../pm-plugins/main';

const filterDecorationByKey = (
  key: TableDecorations,
  decorationSet: DecorationSet,
): Decoration[] =>
  decorationSet.find(undefined, undefined, spec => spec.key.includes(key) > -1);

export const findControlsHoverDecoration = (
  decorationSet: DecorationSet,
): Decoration[] =>
  decorationSet.find(
    undefined,
    undefined,
    spec => spec.key === TableDecorations.CONTROLS_HOVER,
  );

export const createControlsHoverDecoration = (
  cells: Cell[],
  danger?: boolean,
): Decoration[] =>
  cells.map(cell => {
    const classes = [ClassName.HOVERED_CELL];
    if (danger) {
      classes.push(ClassName.HOVERED_CELL_IN_DANGER);
    }

    return Decoration.node(
      cell.pos,
      cell.pos + cell.node.nodeSize,
      {
        class: classes.join(' '),
      },
      { key: TableDecorations.CONTROLS_HOVER },
    );
  });

export const updateDecorations = (
  state: EditorState<any>,
  decorations: Decoration[],
  key: TableDecorations,
) => {
  const node = state.doc;
  const pluginStateDecorationSet = getPluginState(state).decorationSet;
  const filteredDecorations = filterDecorationByKey(
    key,
    pluginStateDecorationSet,
  );
  const decorationSetFiltered = pluginStateDecorationSet.remove(
    filteredDecorations,
  );

  return decorationSetFiltered.add(node, decorations);
};
