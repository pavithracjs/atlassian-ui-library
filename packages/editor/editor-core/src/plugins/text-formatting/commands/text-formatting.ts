import { TextSelection, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { MarkType, Node as PMNode } from 'prosemirror-model';
import { findParentNodeOfType } from 'prosemirror-utils';
import { toggleMark as toggleMarkDefault } from 'prosemirror-commands';
import { removeIgnoredNodesLeft, hasCode } from '../utils';
import { markActive } from '../utils';
import { transformToCodeAction } from './transform-to-code';
import { analyticsService } from '../../../analytics';
import { Command } from '../../../types';
import { CellSelection } from 'prosemirror-tables';

const toggleCellInitialMark = (markType: MarkType, cell: PMNode) => {
  const { initialMarks } = cell.attrs;
  return {
    ...cell.attrs,
    initialMarks:
      initialMarks.indexOf(markType.name) > -1
        ? initialMarks.filter(mark => mark !== markType.name)
        : initialMarks
            .filter(mark => mark !== markType.name)
            .concat([markType.name]),
  };
};

export const toggleMark = (
  markType: MarkType,
  attrs?: { [key: string]: any },
): Command => (state, dispatch) => {
  const { schema, selection, tr } = state;
  const { tableHeader, tableCell } = schema.nodes;
  const cell = findParentNodeOfType([tableHeader, tableCell])(state.selection);
  if (!dispatch || !cell) {
    return toggleMarkDefault(markType, attrs)(state, dispatch);
  }

  if (selection instanceof CellSelection) {
    let enabledOnRange = true;
    selection.forEachCell((cell, pos) => {
      const { initialMarks } = cell.attrs;
      if (initialMarks.indexOf(markType.name) === -1) {
        enabledOnRange = false;
      }
    });

    selection.forEachCell((cell, pos) => {
      const { initialMarks } = cell.attrs;
      const attrs = {
        ...cell.attrs,
        initialMarks: enabledOnRange
          ? initialMarks.filter(mark => mark !== markType.name)
          : initialMarks
              .filter(mark => mark !== markType.name)
              .concat([markType.name]),
      };

      tr.removeStoredMark(markType).setNodeMarkup(pos, cell.type, attrs);
    });
  } else {
    const { initialMarks } = cell.node.attrs;
    const attrs = {
      ...cell.node.attrs,
      initialMarks:
        initialMarks.indexOf(markType.name) > -1
          ? initialMarks.filter(mark => mark !== markType.name)
          : initialMarks
              .filter(mark => mark !== markType.name)
              .concat([markType.name]),
    };
    tr.removeStoredMark(markType).setNodeMarkup(
      cell.pos,
      cell.node.type,
      attrs,
    );
  }

  let has = false;
  for (let i = 0; !has && i < selection.ranges.length; i++) {
    let { $from, $to } = selection.ranges[i];
    has = state.doc.rangeHasMark($from.pos, $to.pos, markType);
  }
  for (let i = 0; i < selection.ranges.length; i++) {
    let { $from, $to } = selection.ranges[i];
    if (has) tr.removeMark($from.pos, $to.pos, markType);
    else tr.addMark($from.pos, $to.pos, markType.create(attrs));
  }

  dispatch(tr);

  return true;
};

export const moveRight = (): Command => {
  return (state, dispatch) => {
    const { code } = state.schema.marks;
    const { empty, $cursor } = state.selection as TextSelection;
    if (!empty || !$cursor) {
      return false;
    }
    const { storedMarks } = state.tr;
    if (code) {
      const insideCode = markActive(state, code.create());
      const currentPosHasCode = state.doc.rangeHasMark(
        $cursor.pos,
        $cursor.pos,
        code,
      );
      const nextPosHasCode = state.doc.rangeHasMark(
        $cursor.pos,
        $cursor.pos + 1,
        code,
      );

      const exitingCode =
        !currentPosHasCode &&
        !nextPosHasCode &&
        (!storedMarks || !!storedMarks.length);
      const enteringCode =
        !currentPosHasCode &&
        nextPosHasCode &&
        (!storedMarks || !storedMarks.length);

      // entering code mark (from the left edge): don't move the cursor, just add the mark
      if (!insideCode && enteringCode) {
        if (dispatch) {
          dispatch(state.tr.addStoredMark(code.create()));
        }
        return true;
      }

      // exiting code mark: don't move the cursor, just remove the mark
      if (insideCode && exitingCode) {
        if (dispatch) {
          dispatch(state.tr.removeStoredMark(code));
        }
        return true;
      }
    }

    return false;
  };
};

export const moveLeft = (
  view: EditorView & { cursorWrapper?: any },
): Command => {
  return (state, dispatch) => {
    const { code } = state.schema.marks;
    const { empty, $cursor } = state.selection as TextSelection;
    if (!empty || !$cursor) {
      return false;
    }

    const { storedMarks } = state.tr;
    if (code) {
      const insideCode = code && markActive(state, code.create());
      const currentPosHasCode = hasCode(state, $cursor.pos);
      const nextPosHasCode = hasCode(state, $cursor.pos - 1);
      const nextNextPosHasCode = hasCode(state, $cursor.pos - 2);

      const exitingCode =
        currentPosHasCode && !nextPosHasCode && Array.isArray(storedMarks);
      const atLeftEdge =
        nextPosHasCode &&
        !nextNextPosHasCode &&
        (storedMarks === null ||
          (Array.isArray(storedMarks) && !!storedMarks.length));
      const atRightEdge =
        ((exitingCode && Array.isArray(storedMarks) && !storedMarks.length) ||
          (!exitingCode && storedMarks === null)) &&
        !nextPosHasCode &&
        nextNextPosHasCode;
      const enteringCode =
        !currentPosHasCode &&
        nextPosHasCode &&
        Array.isArray(storedMarks) &&
        !storedMarks.length;

      // removing ignored nodes (cursor wrapper) to make sure cursor isn't stuck
      if (view.cursorWrapper && !atLeftEdge && !atRightEdge) {
        removeIgnoredNodesLeft(view);
      }

      // at the right edge: remove code mark and move the cursor to the left
      if (!insideCode && atRightEdge) {
        const tr = state.tr.setSelection(
          Selection.near(state.doc.resolve($cursor.pos - 1)),
        );

        if (dispatch) {
          dispatch(tr.removeStoredMark(code));
        }
        return true;
      }

      // entering code mark (from right edge): don't move the cursor, just add the mark
      if (!insideCode && enteringCode) {
        if (dispatch) {
          dispatch(state.tr.addStoredMark(code.create()));
        }
        return true;
      }

      // at the left edge: add code mark and move the cursor to the left
      if (insideCode && atLeftEdge) {
        const tr = state.tr.setSelection(
          Selection.near(state.doc.resolve($cursor.pos - 1)),
        );

        if (dispatch) {
          dispatch(tr.addStoredMark(code.create()));
        }
        return true;
      }

      // exiting code mark (or at the beginning of the line): don't move the cursor, just remove the mark
      const isFirstChild = $cursor.index($cursor.depth - 1) === 0;
      if (
        insideCode &&
        (exitingCode || (!$cursor.nodeBefore && isFirstChild))
      ) {
        if (dispatch) {
          dispatch(state.tr.removeStoredMark(code));
        }
        return true;
      }
    }

    return false;
  };
};

// removing ignored nodes (cursor wrapper) when pressing Backspace to make sure cursor isn't stuck
export const removeIgnoredNodes = (view: EditorView): Command => {
  return state => {
    const { empty, $cursor } = state.selection as TextSelection;
    if (empty && $cursor && $cursor.nodeBefore) {
      removeIgnoredNodesLeft(view);
    }
    return false;
  };
};

export const toggleEm = (): Command => {
  return (state, dispatch) => {
    const { em } = state.schema.marks;
    if (em) {
      return toggleMark(em)(state, dispatch);
    }
    return false;
  };
};

export const toggleStrike = (): Command => {
  return (state, dispatch) => {
    const { strike } = state.schema.marks;
    if (strike) {
      return toggleMark(strike)(state, dispatch);
    }
    return false;
  };
};

export const toggleStrong = (): Command => {
  return (state, dispatch) => {
    const { strong } = state.schema.marks;
    if (strong) {
      return toggleMark(strong)(state, dispatch);
    }
    return false;
  };
};

export const toggleUnderline = (): Command => {
  return (state, dispatch) => {
    const { underline } = state.schema.marks;
    if (underline) {
      return toggleMark(underline)(state, dispatch);
    }
    return false;
  };
};

export const toggleSuperscript = (): Command => {
  return (state, dispatch) => {
    const { subsup } = state.schema.marks;
    if (subsup) {
      if (markActive(state, subsup.create({ type: 'sub' }))) {
        // If subscript is enabled, turn it off first.
        return toggleMark(subsup)(state, dispatch);
      }
      return toggleMark(subsup, { type: 'sup' })(state, dispatch);
    }
    return false;
  };
};

export const toggleSubscript = (): Command => {
  return (state, dispatch) => {
    const { subsup } = state.schema.marks;
    if (subsup) {
      if (markActive(state, subsup.create({ type: 'sup' }))) {
        return toggleMark(subsup)(state, dispatch);
      }
      return toggleMark(subsup, { type: 'sub' })(state, dispatch);
    }
    return false;
  };
};

export const toggleCode = (): Command => {
  return (state, dispatch) => {
    const { code } = state.schema.marks;
    const { from, to } = state.selection;
    if (code) {
      if (!markActive(state, code.create())) {
        if (dispatch) {
          dispatch(transformToCodeAction(from, to, state.tr));
        }
        return true;
      }
      return toggleMark(code)(state, dispatch);
    }
    return false;
  };
};

export const createInlineCodeFromTextInput = (
  from: number,
  to: number,
  text: string,
): Command => {
  return (state, dispatch) => {
    if (state.selection.empty) {
      const { nodeBefore: before } = state.doc.resolve(from);
      const { nodeAfter: after } = state.doc.resolve(to);

      const hasTickBefore = before && before.text && before.text.endsWith('`');
      const hasTickAfter = after && after.text && after.text.startsWith('`');
      if (hasTickBefore && hasTickAfter) {
        analyticsService.trackEvent(
          `atlassian.editor.format.code.autoformatting`,
        );
        const tr = state.tr.replaceRangeWith(
          from - 1,
          to + 1,
          state.schema.text(text),
        );

        if (dispatch) {
          dispatch(
            transformToCodeAction(
              tr.mapping.map(from - 1),
              tr.mapping.map(to + 1),
              tr,
            ),
          );
        }
        return true;
      }
    }
    return false;
  };
};
