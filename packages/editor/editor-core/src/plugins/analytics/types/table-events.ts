import { TableAEP } from './events';
import { I_INPUT_METHOD } from './enums';

//#region Constants
export const enum TABLE_ACTION {
  DELETED = 'deleted',
  CLEARED = 'cleared',
  MERGED = 'merged',
  SPLIT = 'split',
  COLORED = 'colored',
  TOGGLED_HEADER_COLUMN = 'toggledHeaderColumn',
  TOGGLED_HEADER_ROW = 'toggledHeaderRow',
  TOGGLED_NUMBER_COLUMN = 'toggledNumberColumn',
  CHANGED_LAYOUT = 'changedLayout',
  CUT = 'cut',
  COPIED = 'copied',
  ADDED_ROW = 'addedRow',
  ADDED_COLUMN = 'addedColumn',
  DELETED_ROW = 'deletedRow',
  DELETED_COLUMN = 'deletedColumn',
}

export const enum TABLE_LAYOUT {
  WIDE = 'wide',
  FULL_WIDTH = 'fullWidth',
  NORMAL = 'normal',
}
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
  TABLE_ACTION.DELETED,
  {
    inputMethod: I_INPUT_METHOD['KEYBOARD'] | I_INPUT_METHOD['FLOATING_TB'];
  }
>;

type TableClearAEP = TableAEP<
  TABLE_ACTION.CLEARED,
  {
    inputMethod: I_INPUT_METHOD['KEYBOARD'] | I_INPUT_METHOD['CONTEXT_MENU'];
  } & HorizontalAndVerticalCells &
    TotalRowAndColCount
>;

type TableMergeSplitAEP = TableAEP<
  TABLE_ACTION.MERGED | TABLE_ACTION.SPLIT,
  AllCellInfo
>;

type TableColorAEP = TableAEP<
  TABLE_ACTION.COLORED,
  { cellColor: string } & AllCellInfo
>;

type TableToggleHeaderAEP = TableAEP<
  | TABLE_ACTION.TOGGLED_NUMBER_COLUMN
  | TABLE_ACTION.TOGGLED_HEADER_ROW
  | TABLE_ACTION.TOGGLED_HEADER_COLUMN,
  // newState -> true : on, false: off
  { newState: boolean } & TotalRowAndColCount
>;

type TableChangeLayoutAEP = TableAEP<
  TABLE_ACTION.CHANGED_LAYOUT,
  {
    newLayout: TABLE_LAYOUT;
    previousLayout: TABLE_LAYOUT;
  } & TotalRowAndColCount
>;

type TableCopyAndCutAEP = TableAEP<
  TABLE_ACTION.CUT | TABLE_ACTION.COPIED,
  AllCellInfo
>;

type TableAddRowOrColumnAEP = TableAEP<
  TABLE_ACTION.ADDED_ROW | TABLE_ACTION.ADDED_COLUMN,
  {
    inputMethod:
      | I_INPUT_METHOD['SHORTCUT']
      | I_INPUT_METHOD['CONTEXT_MENU']
      | I_INPUT_METHOD['BUTTON']
      | I_INPUT_METHOD['KEYBOARD'];
    position: number;
  } & TotalRowAndColCount
>;

type TableDeleteRowOrColumnAEP = TableAEP<
  TABLE_ACTION.DELETED_ROW | TABLE_ACTION.DELETED_COLUMN,
  {
    inputMethod: I_INPUT_METHOD['CONTEXT_MENU'] | I_INPUT_METHOD['BUTTON'];
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
