import { DecorationSet, Decoration } from 'prosemirror-view';
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { Color as ColorType } from '@atlaskit/status';
import statusNodeView from './nodeviews/status';
import { PMPluginFactory } from '../../types';
import { ZeroWidthSpace } from '../../utils';
import {
  mayGetStatusAtSelection,
  isEmptyStatus,
  mayGetStatusAtPos,
} from './utils';

export const pluginKeyName = 'statusPlugin';
export const pluginKey = new PluginKey('statusPlugin');

export type StatusType = {
  color: ColorType;
  text: string;
  localId?: string;
};

export type StatusState = {
  isNew: boolean;
  showStatusPickerAt: number | null;
  selectedStatus: StatusType | null;
};

const createPlugin: PMPluginFactory = ({
  dispatch,
  portalProviderAPI,
  props: { appearance },
}) =>
  new Plugin({
    state: {
      init: () => ({
        isNew: false,
        showStatusPickerAt: null,
        selectedStatus: null,
      }),
      apply(tr, state: StatusState, oldEditorState) {
        const meta = tr.getMeta(pluginKey);
        const nodeAtSelection = tr.doc.nodeAt(tr.selection.from);

        if (
          state.showStatusPickerAt &&
          (!nodeAtSelection ||
            nodeAtSelection.type !== oldEditorState.schema.nodes.status ||
            // note: Status node has to==from+1 so from==to is positioned just before the Status node and StatusPicker should be dismissed
            tr.selection.from === tr.selection.to)
        ) {
          let newState = {
            ...state,
            showStatusPickerAt: null,
            selectedStatus: null,
          };
          dispatch(pluginKey, newState);
          return newState;
        }

        if (meta) {
          const selectedStatus: StatusType | null = mayGetStatusAtPos(
            meta.showStatusPickerAt,
            tr.doc,
          );
          const newState = { ...state, ...meta, selectedStatus };

          dispatch(pluginKey, newState);
          return newState;
        }

        // Selection changed, check is still status status change required
        const oldSelection = oldEditorState.selection;
        const newSelection = tr.selection;
        if (oldSelection !== newSelection) {
          const selectedStatus = mayGetStatusAtSelection(newSelection);
          const newState = {
            showStatusPickerAt: selectedStatus ? newSelection.from : null,
            selectedStatus,
            isNew: false,
          };

          dispatch(pluginKey, newState);
          return newState;
        }

        if (tr.docChanged && state.showStatusPickerAt) {
          const { pos, deleted } = tr.mapping.mapResult(
            state.showStatusPickerAt,
          );

          const showStatusPickerAt = deleted ? null : pos;

          const newState = {
            ...state,
            showStatusPickerAt,
            selectedStatus: mayGetStatusAtPos(showStatusPickerAt, tr.doc),
          };

          if (newState.showStatusPickerAt !== state.showStatusPickerAt) {
            dispatch(pluginKey, newState);

            return newState;
          }
        }
        return state;
      },
    },
    appendTransaction: (
      transactions: Transaction[],
      oldEditorState: EditorState,
      newEditorState: EditorState,
    ) => {
      let changed = false;
      let tr = newEditorState.tr;

      // user leaves the StatusPicker with empty text and selects a new node
      if (transactions.find(tr => tr.selectionSet)) {
        let oldStatus = mayGetStatusAtSelection(oldEditorState.selection);
        let newStatus = mayGetStatusAtSelection(newEditorState.selection);
        if (
          oldStatus &&
          ((newStatus && oldStatus.localId !== newStatus.localId) || !newStatus)
        ) {
          if (isEmptyStatus(oldStatus)) {
            const pos = oldEditorState.selection.from;
            tr.delete(tr.mapping.map(pos), tr.mapping.map(pos + 1));
            changed = true;
          }
        }
      }
      return changed ? tr : undefined;
    },
    key: pluginKey,
    props: {
      nodeViews: {
        status: statusNodeView(portalProviderAPI, appearance),
      },
      decorations(state: EditorState) {
        const { tr } = state;
        const nodeAtSelection = tr.doc.nodeAt(tr.selection.from);

        if (
          appearance !== 'mobile' &&
          nodeAtSelection &&
          nodeAtSelection.type === state.schema.nodes.status
        ) {
          const delayedNodeRendering = () => {
            return document.createTextNode(ZeroWidthSpace);
          };

          const decoration = Decoration.widget(
            tr.selection.from,
            delayedNodeRendering,
            {
              side: 1,
              key: '#status-zero-width-char-decoration',
            },
          );

          const { doc } = state;
          return DecorationSet.create(doc, [decoration]);
        }

        return null;
      },
    },
  });

export default createPlugin;
