import { TableAEP } from './events';
import { IInputMethod } from './enums';

//#region Constants
export interface ITableAction {
  DELETED: 'deleted';
  CLEARED: 'cleared';
  MERGED: 'merged';
  SPLIT: 'split';
  COLORED: 'colored';
  TOGGLED_HEADER_COLUMN: 'toggledHeaderColumn';
  TOGGLED_HEADER_ROW: 'toggledHeaderRow';
  TOGGLED_NUMBER_COLUMN: 'toggledNumberColumn';
  CHANGED_LAYOUT: 'changedLayout';
  CUT: 'cut';
  COPIED: 'copied';
  ADDED_ROW: 'addedRow';
  ADDED_COLUMN: 'addedColumn';
  DELETED_ROW: 'deletedRow';
  DELETED_COLUMN: 'deletedColumn';
}

export const TABLE_ACTION: ITableAction = {
  DELETED: 'deleted',
  CLEARED: 'cleared',
  MERGED: 'merged',
  SPLIT: 'split',
  COLORED: 'colored',
  TOGGLED_HEADER_COLUMN: 'toggledHeaderColumn',
  TOGGLED_HEADER_ROW: 'toggledHeaderRow',
  TOGGLED_NUMBER_COLUMN: 'toggledNumberColumn',
  CHANGED_LAYOUT: 'changedLayout',
  CUT: 'cut',
  COPIED: 'copied',
  ADDED_ROW: 'addedRow',
  ADDED_COLUMN: 'addedColumn',
  DELETED_ROW: 'deletedRow',
  DELETED_COLUMN: 'deletedColumn',
};
type ValueOf<T> = T[keyof T];

export interface ITableLayout {
  WIDE: 'wide';
  FULL_WIDTH: 'fullWidth';
  NORMAL: 'normal';
}

export const TABLE_LAYOUT: ITableLayout = {
  WIDE: 'wide',
  FULL_WIDTH: 'fullWidth',
  NORMAL: 'normal',
};
//#endregion

//#region Type Helpers
interface TotalRowAndColCount {
  totalRowCount: number;
  totalColumnCount: number;
}

interface HorizontalAndVerticalCells {
  horizontalCells: number;
  verticalCells: number;
}

type AllCellInfo = TotalRowAndColCount &
  HorizontalAndVerticalCells & {
    totalCells: number;
  };
//#endregion

//#region Analytic Event Payloads
type TableDeleteAEP = TableAEP<
  ITableAction['DELETED'],
  {
    inputMethod: IInputMethod['KEYBOARD'] | IInputMethod['FLOATING_TB'];
  }
>;

type TableClearAEP = TableAEP<
  ITableAction['CLEARED'],
  {
    inputMethod: IInputMethod['KEYBOARD'] | IInputMethod['CONTEXT_MENU'];
  } & HorizontalAndVerticalCells &
    TotalRowAndColCount
>;

type TableMergeSplitAEP = TableAEP<
  ITableAction['MERGED'] | ITableAction['SPLIT'],
  AllCellInfo
>;

type TableColorAEP = TableAEP<
  ITableAction['COLORED'],
  { cellColor: string } & AllCellInfo
>;

type TableToggleHeaderAEP = TableAEP<
  | ITableAction['TOGGLED_NUMBER_COLUMN']
  | ITableAction['TOGGLED_HEADER_ROW']
  | ITableAction['TOGGLED_HEADER_COLUMN'],
  // newState -> true : on, false: off
  { newState: boolean } & TotalRowAndColCount
>;

type TableChangeLayoutAEP = TableAEP<
  ITableAction['CHANGED_LAYOUT'],
  {
    newLayout: ValueOf<ITableLayout>;
    previousLayout: ValueOf<ITableLayout>;
  } & TotalRowAndColCount
>;

type TableCopyAndCutAEP = TableAEP<
  ITableAction['CUT'] | ITableAction['COPIED'],
  AllCellInfo
>;

type TableAddRowOrColumnAEP = TableAEP<
  ITableAction['ADDED_ROW'] | ITableAction['ADDED_COLUMN'],
  {
    inputMethod:
      | IInputMethod['SHORTCUT']
      | IInputMethod['CONTEXT_MENU']
      | IInputMethod['BUTTON']
      | IInputMethod['KEYBOARD'];
    position: number;
  } & TotalRowAndColCount
>;

type TableDeleteRowOrColumnAEP = TableAEP<
  ITableAction['DELETED_ROW'] | ITableAction['DELETED_COLUMN'],
  {
    inputMethod: IInputMethod['CONTEXT_MENU'] | IInputMethod['BUTTON'];
    position: number;
    count: number;
  } & TotalRowAndColCount
>;
//#endregion

export type TableEventPayload =
  | TableDeleteAEP
  | TableClearAEP
  | TableMergeSplitAEP
  | TableColorAEP
  | TableToggleHeaderAEP
  | TableChangeLayoutAEP
  | TableCopyAndCutAEP
  | TableAddRowOrColumnAEP
  | TableDeleteRowOrColumnAEP;
