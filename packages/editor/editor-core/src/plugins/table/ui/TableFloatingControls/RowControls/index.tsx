import * as React from 'react';
import { Component, MouseEvent } from 'react';
import { EditorView } from 'prosemirror-view';
import { isCellSelection } from 'prosemirror-utils';
import {
  clearHoverSelection,
  insertRow,
  deleteSelectedRows,
  longPress,
  cancelLongPress,
} from '../../../actions';
import InsertButton from '../InsertButton';
import DeleteButton from '../DeleteButton';
import {
  RowParams,
  getRowHeights,
  isRowInsertButtonVisible,
  isRowDeleteButtonVisible,
  getRowDeleteButtonParams,
  getRowsParams,
  getRowClassNames,
  startLongPress,
  clearLongPress,
} from '../../../utils';
import { TableCssClassName as ClassName } from '../../../types';
import tableMessages from '../../messages';

export interface Props {
  editorView: EditorView;
  tableRef: HTMLTableElement;
  selectRow: (row: number) => void;
  hoverRows: (rows: number[], danger?: boolean) => void;
  hoveredRows?: number[];
  isInDanger?: boolean;
  insertRowButtonIndex?: number;
  draggedRow?: number;
}

export interface State {
  longPressHandler?: number;
}

export default class RowControls extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      editorView,
      tableRef,
      insertRowButtonIndex,
      hoveredRows,
      isInDanger,
      draggedRow,
    } = this.props;
    if (!tableRef) {
      return null;
    }
    const { selection } = editorView.state;
    const rowHeights = getRowHeights(tableRef);
    const rowsParams = getRowsParams(rowHeights);
    const deleteBtnParams = getRowDeleteButtonParams(rowHeights, selection);

    return (
      <div className={ClassName.ROW_CONTROLS}>
        <div className={ClassName.ROW_CONTROLS_INNER}>
          {rowsParams.map(({ startIndex, endIndex, height }: RowParams) => (
            <div
              className={`${
                ClassName.ROW_CONTROLS_BUTTON_WRAP
              } ${getRowClassNames(
                startIndex,
                selection,
                hoveredRows,
                isInDanger,
                draggedRow === startIndex,
              )}`}
              key={startIndex}
              style={{ height }}
            >
              <button
                type="button"
                className={ClassName.CONTROLS_BUTTON}
                onMouseOver={() => this.props.hoverRows([startIndex])}
                onMouseDown={(event: MouseEvent) =>
                  this.handleMouseDown(startIndex, event)
                }
                onMouseUp={this.handleMouseUp}
                onMouseOut={this.clearHoverSelection}
              >
                {!isCellSelection(selection) && (
                  <>
                    <div
                      className={ClassName.CONTROLS_BUTTON_OVERLAY}
                      data-index={startIndex}
                    />
                    <div
                      className={ClassName.CONTROLS_BUTTON_OVERLAY}
                      data-index={endIndex}
                    />
                  </>
                )}
              </button>
              {isRowInsertButtonVisible(endIndex, selection) && (
                <InsertButton
                  type="row"
                  tableRef={tableRef}
                  index={endIndex}
                  showInsertButton={insertRowButtonIndex === endIndex}
                  onMouseDown={() => this.insertRow(endIndex)}
                />
              )}
            </div>
          ))}
          {isRowDeleteButtonVisible(selection) && deleteBtnParams && (
            <DeleteButton
              key="delete"
              removeLabel={tableMessages.removeRows}
              style={{ top: deleteBtnParams.top }}
              onClick={this.deleteSelectedRows}
              onMouseEnter={() =>
                this.props.hoverRows(deleteBtnParams.indexes, true)
              }
              onMouseLeave={this.clearHoverSelection}
            />
          )}
        </div>
      </div>
    );
  }

  private handleMouseDown = (row: number, event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { editorView, selectRow } = this.props;
    const { state, dispatch } = editorView;

    selectRow(row);

    startLongPress(this.state, this.setState.bind(this), () =>
      longPress({ clientX, clientY, rowIndex: row })(state, dispatch),
    );
  };

  private handleMouseUp = () => {
    const {
      editorView: { state, dispatch },
    } = this.props;

    clearLongPress(this.state, this.setState.bind(this), () =>
      cancelLongPress()(state, dispatch),
    );
  };

  private clearHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    clearHoverSelection(state, dispatch);
  };

  private insertRow = (row: number) => {
    const { state, dispatch } = this.props.editorView;
    insertRow(row)(state, dispatch);
  };

  private deleteSelectedRows = () => {
    const { state, dispatch } = this.props.editorView;
    deleteSelectedRows(state, dispatch);
    this.clearHoverSelection();
  };
}
