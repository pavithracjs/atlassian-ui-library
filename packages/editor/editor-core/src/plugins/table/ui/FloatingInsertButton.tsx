import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Node as PmNode } from 'prosemirror-model';
import { findDomRefAtPos, findTable } from 'prosemirror-utils';
import { TableMap } from 'prosemirror-tables';
import { Popup, PopupPosition, PopupProps } from '@atlaskit/editor-common';
import { TableCssClassName as ClassName } from '../types';
import InsertButton from './TableFloatingControls/InsertButton';
import { closestElement } from '../../../utils';
import { INPUT_METHOD } from '../../analytics';
import {
  insertColumnWithAnalytics,
  insertRowWithAnalytics,
} from '../commands-with-analytics';

export interface Props {
  editorView: EditorView;
  tableRef?: HTMLElement;
  tableNode?: PmNode;
  insertColumnButtonIndex?: number;
  insertRowButtonIndex?: number;
  isHeaderColumnEnabled?: boolean;
  isHeaderRowEnabled?: boolean;
  mountPoint?: HTMLElement;
  boundariesElement?: HTMLElement;
  scrollableElement?: HTMLElement;
}

const HORIZONTAL_ALIGN_COLUMN_BUTTON = -10;
const VERTICAL_ALIGN_COLUMN_BUTTON = 14;
const HORIZONTAL_ALIGN_ROW_BUTTON = -34;
const VERTICAL_ALIGN_ROW_BUTTON = 10;

class FloatingInsertButton extends React.Component<
  Props & InjectedIntlProps,
  any
> {
  constructor(props: Props & InjectedIntlProps) {
    super(props);
    this.onPositionCalculatedForColumn = this.onPositionCalculatedForColumn.bind(
      this,
    );
    this.onPositionCalculatedForRow = this.onPositionCalculatedForRow.bind(
      this,
    );
    this.insertColumn = this.insertColumn.bind(this);
    this.insertRow = this.insertRow.bind(this);
  }

  render() {
    const {
      tableNode,
      editorView,
      insertColumnButtonIndex,
      insertRowButtonIndex,
      tableRef,
      mountPoint,
      boundariesElement,
      isHeaderColumnEnabled,
      isHeaderRowEnabled,
    } = this.props;

    const type =
      typeof insertColumnButtonIndex !== 'undefined'
        ? 'column'
        : typeof insertRowButtonIndex !== 'undefined'
        ? 'row'
        : null;
    if (!tableNode || !tableRef || !type) {
      return null;
    }

    // We can’t display the insert button for row|colum index 0
    // when the header row|colum is enabled, this feature will be change on the future
    if (
      (type === 'column' &&
        isHeaderColumnEnabled &&
        insertColumnButtonIndex === 0) ||
      (type === 'row' && isHeaderRowEnabled && insertRowButtonIndex === 0)
    ) {
      return null;
    }

    const tablePos = findTable(editorView.state.selection);
    const domAtPos = editorView.domAtPos.bind(editorView);
    const pos = this.getCellPosition(type) + tablePos!.start + 1;
    const target = findDomRefAtPos(pos, domAtPos);
    if (!target || !(target instanceof HTMLElement)) {
      return null;
    }

    const targetCellRef = closestElement(target, `td, th`);
    if (!targetCellRef) {
      return null;
    }

    const tableContainerWrapper = closestElement(
      targetCellRef,
      `.${ClassName.TABLE_CONTAINER}`,
    );
    const tableWrapper = closestElement(
      targetCellRef,
      `.${ClassName.TABLE_NODE_WRAPPER}`,
    );

    const options: PopupProps =
      type === 'column' ? this.createColumnOptions() : this.createRowOptions();

    return (
      <Popup
        target={targetCellRef}
        mountTo={tableContainerWrapper || mountPoint}
        boundariesElement={tableContainerWrapper || boundariesElement}
        scrollableElement={tableWrapper!}
        forcePlacement={true}
        {...options}
      >
        <InsertButton
          type={type}
          tableRef={tableRef}
          onMouseDown={type === 'column' ? this.insertColumn : this.insertRow}
        />
      </Popup>
    );
  }

  private getCellPosition(type: 'column' | 'row'): number {
    const {
      tableNode,
      insertColumnButtonIndex,
      insertRowButtonIndex,
    } = this.props;
    const tableMap = TableMap.get(tableNode!);

    if (type === 'column') {
      const columnIndex =
        insertColumnButtonIndex === 0 ? 0 : insertColumnButtonIndex! - 1;

      return tableMap.positionAt(0, columnIndex!, tableNode!);
    } else {
      const rowIndex =
        insertRowButtonIndex === 0 ? 0 : insertRowButtonIndex! - 1;

      return tableMap.positionAt(rowIndex!, 0, tableNode!);
    }
  }

  private createRowOptions(): PopupProps {
    const { insertRowButtonIndex } = this.props;
    const options = {
      alignX: 'left',
      alignY: 'bottom',
      offset: [HORIZONTAL_ALIGN_ROW_BUTTON, VERTICAL_ALIGN_ROW_BUTTON],
      onPositionCalculated: this.onPositionCalculatedForRow,
    } as PopupProps;

    if (insertRowButtonIndex === 0) {
      return {
        ...options,
        alignX: 'left',
        alignY: 'top',
      };
    }

    return options;
  }

  private createColumnOptions(): PopupProps {
    const { insertColumnButtonIndex } = this.props;
    const options = {
      alignX: 'end',
      alignY: 'top',
      offset: [HORIZONTAL_ALIGN_COLUMN_BUTTON, VERTICAL_ALIGN_COLUMN_BUTTON],
      onPositionCalculated: this.onPositionCalculatedForColumn,
    } as PopupProps;

    // We need to change the popup position when
    // the column index is zero
    if (insertColumnButtonIndex === 0) {
      return {
        ...options,
        alignX: 'left',
        alignY: 'top',
      };
    }

    return options;
  }

  private insertRow() {
    const { editorView, insertRowButtonIndex } = this.props;

    if (typeof insertRowButtonIndex !== 'undefined') {
      const { state, dispatch } = editorView;
      insertRowWithAnalytics(INPUT_METHOD.BUTTON, insertRowButtonIndex)(
        state,
        dispatch,
      );
    }
  }

  private insertColumn() {
    const { editorView, insertColumnButtonIndex } = this.props;

    if (typeof insertColumnButtonIndex !== 'undefined') {
      const { state, dispatch } = editorView;
      insertColumnWithAnalytics(INPUT_METHOD.BUTTON, insertColumnButtonIndex)(
        state,
        dispatch,
      );
    }
  }

  private onPositionCalculatedForRow(position: PopupPosition) {
    const { bottom } = position;
    const { insertRowButtonIndex } = this.props;
    const left = HORIZONTAL_ALIGN_ROW_BUTTON;

    if (bottom && insertRowButtonIndex === 0) {
      return {
        ...position,
        bottom: bottom - 24,
        left,
      };
    }

    return {
      ...position,
      left,
    };
  }

  // :: (position: PopupPosition) -> PopupPosition
  // Limit the InsertButton position to the table container
  // if the left position starts before it
  // we should always set the InsertButton on the start,
  // considering the offset from the first column
  private onPositionCalculatedForColumn(position: PopupPosition) {
    const { left } = position;
    const { tableRef, insertColumnButtonIndex } = this.props;

    if (!left) {
      return position;
    }

    if (insertColumnButtonIndex === 0) {
      return {
        ...position,
        left: HORIZONTAL_ALIGN_COLUMN_BUTTON,
      };
    }

    const tableContainerWrapper = closestElement(
      tableRef,
      `.${ClassName.TABLE_CONTAINER}`,
    );
    const rect = tableContainerWrapper
      ? tableContainerWrapper.getBoundingClientRect()
      : null;

    return {
      ...position,
      left: rect && left > rect.width ? rect.width : left,
    };
  }
}

export default injectIntl(FloatingInsertButton);
