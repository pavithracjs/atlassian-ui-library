import { INLINE_COMMENT } from '@atlaskit/adf-schema';

import { Command } from '../../../types';
import { Selection } from 'prosemirror-state';
import { pluginKey } from '../pm-plugins/main';
import { cascadeCommands } from '../../../utils/action';

export const setAnnotationQueryMarkAtCurrentPos = (
  annotationType: string,
): Command => (state, dispatch): boolean => {
  const { tr } = state;
  const { from, to } = state.selection;
  const annotationMark = state.schema.marks.annotationQuery;
  tr.addMark(from, to, annotationMark.create());
  tr.setMeta(pluginKey, { annotationType });
  if (dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
};

export const removeAnnotationQueryMark = (): Command => (
  state,
  dispatch,
): boolean => {
  const { tr } = state;
  const annotationMark = state.schema.marks.annotationQuery;
  tr.removeMark(0, state.doc.nodeSize - 2, annotationMark);
  if (dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
};

export const createAnnotationMarkAtCurrentPos = (
  id: string,
  annotationType: string,
): Command => (state, dispatch): boolean => {
  let { tr } = state;
  const { from, to } = state.selection;
  const annotationMark = state.schema.marks.annotation;
  tr.addMark(from, to, annotationMark.create({ id, annotationType }));
  tr.setSelection(Selection.near(tr.doc.resolve(to)));
  if (dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
};

export const insertInlineCommentAtCurrentPos = (id: string): Command => (
  state,
  dispatch,
) =>
  cascadeCommands([
    removeAnnotationQueryMark(),
    createAnnotationMarkAtCurrentPos(id, INLINE_COMMENT),
  ])(state, dispatch);

export const removeInlineCommentAtCurrentPos = (): Command => (
  state,
  dispatch,
): boolean => {
  const {
    tr,
    selection: { $from },
  } = state;
  const pos = $from.pos - $from.textOffset;
  const annotationMark = state.schema.marks.annotation;
  const node = state.doc.nodeAt($from.pos);
  tr.removeMark(pos, pos + node!.nodeSize, annotationMark);
  if (dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
};
