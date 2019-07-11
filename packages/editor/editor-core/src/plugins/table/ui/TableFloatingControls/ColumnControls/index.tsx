import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Selection } from 'prosemirror-state';
import { browser } from '@atlaskit/editor-common';

import {
  hoverColumns,
  selectColumn,
  clearHoverSelection,
} from '../../../commands';
import { TableCssClassName as ClassName } from '../../../types';
import {
  isSelectionUpdated,
  getColumnsWidths,
  getColumnsParams,
  getColumnClassNames,
  ColumnParams,
} from '../../../utils';
export interface Props {
  editorView: EditorView;
  hoveredColumns?: number[];
  isInDanger?: boolean;
  isResizing?: boolean;
  numberOfColumns?: number;
  selection?: Selection;
  tableRef?: HTMLTableElement;
}

export default class ColumnControls extends Component<Props, any> {
  shouldComponentUpdate(nextProps: Props) {
    const {
      tableRef,
      selection,
      numberOfColumns,
      hoveredColumns,
      isInDanger,
      isResizing,
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
      isInDanger !== nextProps.isInDanger ||
      isResizing !== nextProps.isResizing ||
      numberOfColumns !== nextProps.numberOfColumns ||
      hoveredColumns !== nextProps.hoveredColumns ||
      isSelectionUpdated(selection!, nextProps.selection)
    );
  }

  render() {
    const {
      editorView,
      tableRef,
      hoveredColumns,
      isInDanger,
      isResizing,
    } = this.props;
    if (!tableRef || !tableRef.querySelector('tr')) {
      return null;
    }

    const { selection } = editorView.state;
    const columnsWidths = getColumnsWidths(editorView);
    const columnsParams = getColumnsParams(columnsWidths);

    return (
      <div className={ClassName.COLUMN_CONTROLS}>
        <div className={ClassName.COLUMN_CONTROLS_INNER}>
          <>
            {columnsParams.map(({ startIndex, width }: ColumnParams) => (
              <div
                className={`${
                  ClassName.COLUMN_CONTROLS_BUTTON_WRAP
                } ${getColumnClassNames(
                  startIndex,
                  selection,
                  hoveredColumns,
                  isInDanger,
                  isResizing,
                )}`}
                key={startIndex}
                style={{ width }}
                onMouseDown={e => e.preventDefault()}
              >
                <button
                  type="button"
                  className={`${ClassName.COLUMN_CONTROLS_BUTTON} ${
                    ClassName.CONTROLS_BUTTON
                  }`}
                  onClick={event =>
                    this.selectColumn(startIndex, event.shiftKey)
                  }
                  onMouseOver={() => this.hoverColumns([startIndex])}
                  onMouseOut={this.clearHoverSelection}
                  data-index={startIndex}
                />
              </div>
            ))}
          </>
        </div>
      </div>
    );
  }

  private selectColumn = (column: number, expand: boolean) => {
    const { editorView } = this.props;
    const { state, dispatch } = editorView;
    // fix for issue ED-4665
    if (browser.ie_version === 11) {
      (editorView.dom as HTMLElement).blur();
    }
    selectColumn(column, expand)(state, dispatch);
  };

  private hoverColumns = (columns: number[], danger?: boolean) => {
    const { state, dispatch } = this.props.editorView;
    hoverColumns(columns, danger)(state, dispatch);
  };

  private clearHoverSelection = () => {
    const { state, dispatch } = this.props.editorView;
    clearHoverSelection()(state, dispatch);
  };
}
