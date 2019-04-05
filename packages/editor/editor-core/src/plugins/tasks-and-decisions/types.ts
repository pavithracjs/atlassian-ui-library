import { Transaction, EditorState } from 'prosemirror-state';
import { NodeType } from 'prosemirror-model';
import { IInputMethod, IUserContext } from '../analytics';
import { ValueOf } from '../../utils/types';

export type TaskDecisionListType = 'taskList' | 'decisionList';

export type TaskDecisionInputMethod =
  | IInputMethod['TOOLBAR']
  | IInputMethod['INSERT_MENU']
  | IInputMethod['QUICK_INSERT']
  | IInputMethod['FORMATTING']
  | IInputMethod['KEYBOARD'];

export type ContextData = {
  objectId: string;
  containerId: string;
  userContext: ValueOf<IUserContext>;
};

export type AddItemTransactionCreator = (
  opts: {
    state: EditorState;
    tr: Transaction;
    list: NodeType;
    item: NodeType;
    listLocalId: string;
    itemLocalId: string;
  },
) => Transaction | null;
