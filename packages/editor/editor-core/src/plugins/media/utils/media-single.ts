import { Node as PMNode, Schema, Fragment, Slice } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { MediaSingleLayout, MediaSingleAttributes } from '@atlaskit/adf-schema';

import {
  isImage,
  atTheBeginningOfBlock,
  checkNodeDown,
  isEmptyParagraph,
} from '../../../utils';
import { copyOptionalAttrsFromMediaState } from '../utils/media-common';
import { MediaState } from '../types';
import { safeInsert, hasParentNodeOfType } from 'prosemirror-utils';
import { EditorState, Selection } from 'prosemirror-state';
import { Command } from '../../../types';
import { mapSlice } from '../../../utils/slice';

export interface MediaSingleState extends MediaState {
  dimensions: { width: number; height: number };
  scaleFactor?: number;
}

function shouldAddParagraph(state: EditorState) {
  return (
    atTheBeginningOfBlock(state) &&
    !checkNodeDown(state.selection, state.doc, isEmptyParagraph)
  );
}

function insertNodesWithOptionalParagraph(nodes: PMNode[]): Command {
  return function(state, dispatch) {
    const { tr, schema } = state;
    const { paragraph } = schema.nodes;

    let openEnd = 0;
    if (shouldAddParagraph(state)) {
      nodes.push(paragraph.create());
      openEnd = 1;
    }

    tr.replaceSelection(new Slice(Fragment.from(nodes), 0, openEnd));

    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}

export const insertMediaAsMediaSingle = (
  view: EditorView,
  node: PMNode,
): boolean => {
  const { state, dispatch } = view;
  const { mediaSingle, media } = state.schema.nodes;

  if (!mediaSingle) {
    return false;
  }

  // if not an image type media node
  if (
    node.type !== media ||
    (!isImage(node.attrs.__fileMimeType) && node.attrs.type !== 'external')
  ) {
    return false;
  }

  const mediaSingleNode = mediaSingle.create({}, node);
  const nodes = [mediaSingleNode];
  return insertNodesWithOptionalParagraph(nodes)(state, dispatch);
};

export const insertMediaSingleNode = (
  view: EditorView,
  mediaState: MediaState,
  collection?: string,
): boolean => {
  if (collection === undefined) {
    return false;
  }

  const { state, dispatch } = view;
  const grandParent = state.selection.$from.node(-1);
  const node = createMediaSingleNode(state.schema, collection)(
    mediaState as MediaSingleState,
  );
  const shouldSplit =
    grandParent && grandParent.type.validContent(Fragment.from(node));

  if (shouldSplit) {
    insertNodesWithOptionalParagraph([node])(state, dispatch);
  } else {
    dispatch(
      safeInsert(
        shouldAddParagraph(view.state)
          ? Fragment.fromArray([node, state.schema.nodes.paragraph.create()])
          : node,
      )(state.tr),
    );
  }

  return true;
};

export const createMediaSingleNode = (schema: Schema, collection: string) => (
  mediaState: MediaSingleState,
) => {
  const { id, dimensions, scaleFactor = 1 } = mediaState;
  const { width, height } = dimensions || {
    height: undefined,
    width: undefined,
  };
  const { media, mediaSingle } = schema.nodes;

  const mediaNode = media.create({
    id,
    type: 'file',
    collection,
    width: width && Math.round(width / scaleFactor),
    height: height && Math.round(height / scaleFactor),
  });

  copyOptionalAttrsFromMediaState(mediaState, mediaNode);
  return mediaSingle.createChecked({}, mediaNode);
};

export function transformSliceForMedia(slice: Slice, schema: Schema) {
  const {
    mediaSingle,
    layoutSection,
    table,
    bulletList,
    orderedList,
  } = schema.nodes;

  return (selection: Selection) => {
    if (
      hasParentNodeOfType([layoutSection, table, bulletList, orderedList])(
        selection,
      )
    ) {
      return mapSlice(slice, node =>
        node.type.name === 'mediaSingle'
          ? mediaSingle.createChecked({}, node.content, node.marks)
          : node,
      );
    }

    return slice;
  };
}

export const alignAttributes = (
  layout: MediaSingleLayout,
  oldAttrs: MediaSingleAttributes,
  gridSize: number = 12,
): MediaSingleAttributes => {
  let width = oldAttrs.width;
  const oldLayout: MediaSingleLayout = oldAttrs.layout;
  const wrappedLayouts: MediaSingleLayout[] = [
    'wrap-left',
    'wrap-right',
    'align-end',
    'align-start',
  ];

  if (
    (!width || width === 100) &&
    ['align-start', 'align-end', 'wrap-left', 'wrap-right'].indexOf(
      oldLayout,
    ) === -1 &&
    ['align-start', 'align-end', 'wrap-left', 'wrap-right'].indexOf(layout) > -1
  ) {
    width = 50;
  } else if (
    layout !== oldLayout &&
    ['full-width', 'wide'].indexOf(oldLayout) > -1
  ) {
    // unset width
    width = undefined;
  } else if (width) {
    const cols = Math.round((width / 100) * gridSize);
    let targetCols = cols;

    const nonWrappedLayouts: MediaSingleLayout[] = [
      'center',
      'wide',
      'full-width',
    ];

    if (
      wrappedLayouts.indexOf(oldLayout) > -1 &&
      nonWrappedLayouts.indexOf(layout) > -1
    ) {
      // wrap -> center needs to align to even grid
      targetCols = Math.floor(targetCols / 2) * 2;
    } else if (
      nonWrappedLayouts.indexOf(oldLayout) > -1 &&
      wrappedLayouts.indexOf(layout) > -1
    ) {
      // cannot resize to full column width, and cannot resize to 1 column

      if (cols <= 1) {
        targetCols = 2;
      } else if (cols >= gridSize) {
        targetCols = 10;
      }
    }

    if (targetCols !== cols) {
      width = (targetCols / gridSize) * 100;
    }
  }

  return {
    ...oldAttrs,
    layout,
    width,
  };
};
