import * as React from 'react';
import { Component, MouseEvent, SyntheticEvent } from 'react';
import { EditorView } from 'prosemirror-view';
import { Selection } from 'prosemirror-state';
import { isCellSelection } from 'prosemirror-utils';
import { browser } from '@atlaskit/editor-common';
import InsertButton from '../InsertButton';
import DeleteButton from '../DeleteButton';
import {
  isSelectionUpdated,
  getColumnsWidths,
  isColumnDeleteButtonVisible,
  getColumnDeleteButtonParams,
  isColumnInsertButtonVisible,
  getColumnsParams,
  getColumnClassNames,
  ColumnParams,
  startLongPress,
  clearLongPress,
} from '../../../utils';
import {
  clearHoverSelection,
  hoverColumns,
  insertColumn,
  deleteSelectedColumns,
  selectColumn,
  longPress,
  cancelLongPress,
} from '../../../actions';
import { TableCssClassName as ClassName } from '../../../types';
import tableMessages from '../../messages';

export interface Props {
  editorView: EditorView;
  hoveredColumns?: number[];
  isInDanger?: boolean;
  insertColumnButtonIndex?: number;
  numberOfColumns?: number;
  selection?: Selection;
  tableRef?: HTMLTableElement;
  draggedCol?: number;
}

export interface State {
  longPressHandler?: number;
}

export default class ColumnControls extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps) {
    const {
      tableRef,
      selection,
      numberOfColumns,
      hoveredColumns,
      insertColumnButtonIndex,
      isInDanger,
      draggedCol,
    } = this.props;

    if (nextProps.tableRef) {
      const controls = nextProps.tableRef.parentNode!.firstChild as HTMLElement;
      // checks if controls width is different from table width
      // 1px difference is acceptable and occurs in some situations due to the browser rendering specifics
      const shouldUpdate =
        Math.abs(controls.offsetWidth - nextProps.tableRef.offsetWidth) > 1;
      if (shouldUpdate) {
        return true;
      }
    }

    return (
      tableRef !== nextProps.tableRef ||
      insertColumnButtonIndex !== nextProps.insertColumnButtonIndex ||
      isInDanger !== nextProps.isInDanger ||
      numberOfColumns !== nextProps.numberOfColumns ||
      hoveredColumns !== nextProps.hoveredColumns ||
      draggedCol !== nextProps.draggedCol ||
      isSelectionUpdated(selection!, nextProps.selection)
    );
  }

  render() {
    const {
      editorView,
      tableRef,
      insertColumnButtonIndex,
      hoveredColumns,
      isInDanger,
      draggedCol,
    } = this.props;
    if (!tableRef || !tableRef.querySelector('tr')) {
      return null;
    }

    const { selection } = editorView.state;
    const columnsWidths = getColumnsWidths(editorView);
    const columnsParams = getColumnsParams(columnsWidths);
    const deleteBtnParams = getColumnDeleteButtonParams(
      columnsWidths,
      selection,
    );

    return (
      <div className={ClassName.COLUMN_CONTROLS}>
        <div className={ClassName.COLUMN_CONTROLS_INNER}>
          <>
            {columnsParams.map(
              ({ startIndex, endIndex, width }: ColumnParams) => (
                <div
                  className={`${
                    ClassName.COLUMN_CONTROLS_BUTTON_WRAP
                  } ${getColumnClassNames(
                    startIndex,
                    selection,
                    hoveredColumns,
                    isInDanger,
                    draggedCol === startIndex,
                  )}`}
                  key={startIndex}
                  style={{ width }}
                  onMouseDown={e => e.preventDefault()}
                >
                  <button
                    type="button"
                    className={ClassName.CONTROLS_BUTTON}
                    onMouseOver={() => this.hoverColumns([startIndex])}
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
                  {isColumnInsertButtonVisible(endIndex, selection) && (
                    <InsertButton
                      type="column"
                      tableRef={tableRef}
                      index={endIndex}
                      showInsertButton={insertColumnButtonIndex === endIndex}
                      onMouseDown={() => this.insertColumn(endIndex)}
                    />
                  )}
                </div>
              ),
            )}
            {isColumnDeleteButtonVisible(selection) && deleteBtnParams && (
              <DeleteButton
                key="delete"
                removeLabel={tableMessages.removeColumns}
                style={{ left: deleteBtnParams.left }}
                onClick={this.deleteColumns}
                onMouseEnter={() =>
                  this.hoverColumns(deleteBtnParams.indexes, true)
                }
                onMouseLeave={this.clearHoverSelection}
              />
            )}
          </>
        </div>
      </div>
    );
  }

  private deleteColumns = (event: SyntheticEvent) => {
    event.preventDefault();
    const { state, dispatch } = this.props.editorView;
    deleteSelectedColumns(state, dispatch);
    this.clearHoverSelection();
  };

  private handleMouseDown = (column: number, event: MouseEvent) => {
    const { clientX, clientY } = event;
    const { editorView } = this.props;
    const { state, dispatch } = editorView;

    // fix for issue ED-4665
    if (browser.ie_version === 11) {
      (editorView.dom as HTMLElement).blur();
    }

    selectColumn(column)(state, dispatch);

    startLongPress(this.state, this.setState.bind(this), () =>
      longPress({ clientX, clientY, colIndex: column })(state, dispatch),
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

  private hoverColumns = (columns: number[], danger?: boolean) => {
    const { state, dispatch } = this.props.editorView;
    hoverColumns(columns, danger)(state, dispatch);
  };

  private clearHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    clearHoverSelection(state, dispatch);
  };

  private insertColumn = (column: number) => {
    const { state, dispatch } = this.props.editorView;
    insertColumn(column)(state, dispatch);
  };
}
