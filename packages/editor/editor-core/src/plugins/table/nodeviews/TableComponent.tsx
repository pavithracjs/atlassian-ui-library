import * as React from 'react';
import rafSchedule from 'raf-schd';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  browser,
  calcTableWidth,
  akEditorMobileBreakoutPoint,
} from '@atlaskit/editor-common';

import TableFloatingControls from '../ui/TableFloatingControls';
import ColumnControls from '../ui/TableFloatingControls/ColumnControls';

import { getPluginState } from '../pm-plugins/main';
import { ResizeState, scaleTable } from '../pm-plugins/table-resizing';
import {
  getParentNodeWidth,
  getLayoutSize,
  insertColgroupFromNode as recreateResizeColsByNode,
} from '../pm-plugins/table-resizing/utils';

import { TablePluginState, TableCssClassName as ClassName } from '../types';
import classnames from 'classnames';
const isIE11 = browser.ie_version === 11;

import { Props } from './table';
import {
  containsHeaderRow,
  checkIfHeaderColumnEnabled,
  checkIfHeaderRowEnabled,
  tablesHaveDifferentColumnWidths,
  tablesHaveDifferentNoOfColumns,
  getTableWidth,
} from '../utils';
import { autoSizeTable } from '../commands';
import { WidthPluginState } from '../../width';

/**
 * The sum of column widths usually never equal the layout width (off by up to 5, depending on amount of cols),
 * 20 is a safe number to determine they belong to a layout, but big enough to tell the difference between layouts.
 */
const TABLE_LAYOUT_DIFF_BUFFER = 20;

export interface ComponentProps extends Props {
  view: EditorView;
  node: PmNode;
  allowColumnResizing: boolean;
  contentDOM: (element: HTMLElement | undefined) => void;

  containerWidth: WidthPluginState;
  pluginState: TablePluginState;
  tableResizingPluginState?: ResizeState;
  width: number;
}

interface TableState {
  scroll: number;
  tableContainerWidth: string;
  parentWidth?: number;
}

class TableComponent extends React.Component<ComponentProps, TableState> {
  state = {
    scroll: 0,
    tableContainerWidth: 'inherit',
    parentWidth: undefined,
  };

  private wrapper?: HTMLDivElement | null;
  private table?: HTMLTableElement | null;
  private rightShadow?: HTMLDivElement | null;
  private frameId?: number;
  private node?: PmNode;
  private containerWidth?: WidthPluginState;

  constructor(props: ComponentProps) {
    super(props);

    this.node = props.node;
    this.containerWidth = props.containerWidth;

    // Disable inline table editing and resizing controls in Firefox
    // https://github.com/ProseMirror/prosemirror/issues/432
    if ('execCommand' in document) {
      ['enableObjectResizing', 'enableInlineTableEditing'].forEach(cmd => {
        if (document.queryCommandSupported(cmd)) {
          document.execCommand(cmd, false, 'false');
        }
      });
    }
  }

  componentDidMount() {
    const { allowColumnResizing } = this.props;
    if (allowColumnResizing && this.wrapper && !isIE11) {
      this.wrapper.addEventListener('scroll', this.handleScrollDebounced);
    }

    if (allowColumnResizing) {
      /**
       * We no longer use `containerWidth` as a variable to determine an update for table resizing (avoids unnecessary updates).
       * Instead we use the resize event to only trigger updates when necessary.
       */
      window.addEventListener('resize', this.handleWindowResizeDebounced);
      this.updateTableContainerWidth();
      this.frameId = this.handleTableResizingDebounced(this.props);
    }
  }

  componentWillUnmount() {
    if (this.wrapper && !isIE11) {
      this.wrapper.removeEventListener('scroll', this.handleScrollDebounced);
    }

    this.handleScrollDebounced.cancel();

    if (this.props.allowColumnResizing) {
      window.removeEventListener('resize', this.handleWindowResizeDebounced);
    }

    if (this.frameId && window) {
      window.cancelAnimationFrame(this.frameId);
    }
  }

  componentDidUpdate(prevProps: ComponentProps) {
    updateRightShadow(this.wrapper, this.table, this.rightShadow);

    if (this.props.node.attrs.__autoSize) {
      // Wait for next tick to handle auto sizing, gives the browser time to do layout calc etc.
      this.handleAutoSizeDebounced();
    } else if (this.props.allowColumnResizing && this.table) {
      // If col widths (e.g. via collab) or number of columns (e.g. delete a column) have changed,
      // re-draw colgroup.
      if (
        tablesHaveDifferentColumnWidths(this.props.node, prevProps.node) ||
        tablesHaveDifferentNoOfColumns(this.props.node, prevProps.node)
      ) {
        recreateResizeColsByNode(this.table, this.props.node);
      }

      this.frameId = this.handleTableResizingDebounced(prevProps);
    }
  }

  render() {
    const {
      view,
      node,
      pluginState,
      tableResizingPluginState,
      width,
    } = this.props;

    const {
      pluginConfig: { allowControls = true },
    } = pluginState;

    // doesn't work well with WithPluginState
    const {
      isInDanger,
      hoveredColumns,
      hoveredRows,
      insertColumnButtonIndex,
      insertRowButtonIndex,
    } = getPluginState(view.state);

    const tableRef = this.table || undefined;
    const tableActive = this.table === pluginState.tableRef;
    const isResizing =
      !!tableResizingPluginState && !!tableResizingPluginState.dragging;
    const { scroll } = this.state;

    const rowControls = [
      <div
        key={0}
        className={`${ClassName.ROW_CONTROLS_WRAPPER} ${
          scroll > 0 ? ClassName.TABLE_LEFT_SHADOW : ''
        }`}
      >
        <TableFloatingControls
          editorView={view}
          tableRef={tableRef}
          tableActive={tableActive}
          hoveredRows={hoveredRows}
          isInDanger={isInDanger}
          isResizing={isResizing}
          isNumberColumnEnabled={node.attrs.isNumberColumnEnabled}
          isHeaderColumnEnabled={checkIfHeaderColumnEnabled(view.state)}
          isHeaderRowEnabled={checkIfHeaderRowEnabled(view.state)}
          hasHeaderRow={containsHeaderRow(view.state, node)}
          // pass `selection` and `tableHeight` to control re-render
          selection={view.state.selection}
          tableHeight={tableRef ? tableRef.offsetHeight : undefined}
          insertColumnButtonIndex={insertColumnButtonIndex}
          insertRowButtonIndex={insertRowButtonIndex}
        />
      </div>,
    ];

    const columnControls = [
      <div key={0} className={ClassName.COLUMN_CONTROLS_WRAPPER}>
        <ColumnControls
          editorView={view}
          tableRef={tableRef}
          hoveredColumns={hoveredColumns}
          isInDanger={isInDanger}
          isResizing={isResizing}
          // pass `selection` and `numberOfColumns` to control re-render
          selection={view.state.selection}
          numberOfColumns={node.firstChild!.childCount}
          insertColumnButtonIndex={insertColumnButtonIndex}
        />
      </div>,
    ];

    return (
      <div
        style={{
          width: this.state.tableContainerWidth,
        }}
        className={classnames(ClassName.TABLE_CONTAINER, {
          [ClassName.WITH_CONTROLS]: tableActive,
          'less-padding': width < akEditorMobileBreakoutPoint,
        })}
        data-number-column={node.attrs.isNumberColumnEnabled}
        data-layout={node.attrs.layout}
      >
        {allowControls && rowControls}
        <div
          className={classnames(ClassName.TABLE_NODE_WRAPPER)}
          ref={elem => {
            this.wrapper = elem;
            this.props.contentDOM(elem ? elem : undefined);
            if (elem) {
              this.table = elem.querySelector('table');
            }
          }}
        >
          {allowControls && columnControls}
        </div>
        <div
          ref={elem => {
            this.rightShadow = elem;
          }}
          className={ClassName.TABLE_RIGHT_SHADOW}
        />
      </div>
    );
  }

  private handleScroll = (event: Event) => {
    if (!this.wrapper || event.target !== this.wrapper) {
      return;
    }

    this.setState({ scroll: this.wrapper.scrollLeft });
  };

  private handleTableResizing = (prevProps: ComponentProps) => {
    const { pluginState: prevPluginState } = prevProps;
    const { node, pluginState, containerWidth } = this.props;
    const prevWidth = this.containerWidth!.width;
    const prevNode = this.node!;
    const prevAttrs = prevNode.attrs;

    // We only consider a layout change valid if it's done outside of an autoSize.
    const layoutChanged =
      prevAttrs.layout !== node.attrs.layout &&
      prevAttrs.__autoSize === node.attrs.__autoSize;

    const parentWidth = this.getParentNodeWidth();
    const parentWidthChanged =
      parentWidth && parentWidth !== this.state.parentWidth;

    const currentLayoutSize = this.tableNodeLayoutSize(node);
    const prevLayoutSize = this.tableNodeLayoutSize(prevNode, prevWidth);
    const tableColWidths = getTableWidth(node);

    /**
     * When we focus the table, we may need to scale the table
     * We only want to scale if the size of table doesn't match
     * the current layout of the table, this is generally due to
     * dynamic text sizing (once unshipped we can delete these lines :) ).
     */
    const shouldScaleForDynamicTextSizing =
      pluginState.tableRef === this.table &&
      prevPluginState.tableRef !== this.table &&
      currentLayoutSize % tableColWidths > TABLE_LAYOUT_DIFF_BUFFER;

    if (
      // Breakout mode/layout changed
      layoutChanged ||
      // We need to react if our parent changes
      // Scales the cols widths relative to the new parent width.
      parentWidthChanged ||
      // Enabling / disabling this feature reduces or adds size to the table.
      prevAttrs.isNumberColumnEnabled !== node.attrs.isNumberColumnEnabled ||
      // Adding or removing columns from the table, should snap the remaining / new columns to the layout width.
      tablesHaveDifferentNoOfColumns(node, prevNode) ||
      // Controls read from col widths, when the table is focused we want to ensure that current layout
      // matches with the current dynamically sized layout. Shouldn't trigger often.
      shouldScaleForDynamicTextSizing ||
      // This last check is also to cater for dynamic text sizing changing the 'default' layout width
      // Usually happens on window resize.
      currentLayoutSize !== prevLayoutSize
    ) {
      this.scaleTable(parentWidth);
      this.updateParentWidth(parentWidth);
    }

    this.updateTableContainerWidth();
    this.node = node;
    this.containerWidth = containerWidth;
  };

  private scaleTable = (parentWidth?: number) => {
    const { view, node, getPos, containerWidth, options } = this.props;
    const { state, dispatch } = view;
    const domAtPos = view.domAtPos.bind(view);
    const { width } = containerWidth;

    if (this.frameId && window) {
      window.cancelAnimationFrame(this.frameId);
    }

    scaleTable(
      this.table,
      {
        node,
        prevNode: this.node || node,
        parentWidth,
        start: getPos() + 1,
        containerWidth: width,
        previousContainerWidth: this.containerWidth!.width || width,
        ...options,
      },
      domAtPos,
    )(state, dispatch);
  };

  private handleAutoSize = () => {
    if (this.table) {
      const { view, node, getPos, options, containerWidth } = this.props;

      autoSizeTable(view, node, this.table, getPos(), {
        dynamicTextSizing: (options && options.dynamicTextSizing) || false,
        containerWidth: containerWidth.width,
      });
    }
  };

  private handleWindowResize = () => {
    const { node, containerWidth } = this.props;

    const layoutSize = this.tableNodeLayoutSize(node);

    if (containerWidth.width > layoutSize) {
      return;
    }

    const parentWidth = this.getParentNodeWidth();
    this.frameId = this.scaleTableDebounced(parentWidth);
  };

  private updateTableContainerWidth = () => {
    const { node, containerWidth, options } = this.props;

    if (options && options.isBreakoutEnabled === false) {
      return;
    }

    this.setState((prevState: TableState) => {
      const tableContainerWidth = calcTableWidth(
        node.attrs.layout,
        containerWidth.width,
      );

      if (
        options &&
        options.isBreakoutEnabled === false &&
        prevState.tableContainerWidth !== 'inherit'
      ) {
        return { tableContainerWidth: 'inherit' };
      }

      if (prevState.tableContainerWidth === tableContainerWidth) {
        return null;
      }

      return {
        tableContainerWidth,
      };
    });
  };

  private getParentNodeWidth = () =>
    getParentNodeWidth(
      this.props.getPos(),
      this.props.view.state,
      this.props.containerWidth,
      this.props.options && this.props.options.isFullWidthModeEnabled,
    );

  private updateParentWidth = (width?: number) => {
    this.setState({ parentWidth: width });
  };

  private tableNodeLayoutSize = (node: PmNode, containerWidth?: number) =>
    getLayoutSize(
      node.attrs.layout,
      containerWidth || this.props.containerWidth.width,
      this.props.options || {},
    );

  private scaleTableDebounced = rafSchedule(this.scaleTable);
  private handleTableResizingDebounced = rafSchedule(this.handleTableResizing);
  private handleScrollDebounced = rafSchedule(this.handleScroll);
  private handleAutoSizeDebounced = rafSchedule(this.handleAutoSize);
  private handleWindowResizeDebounced = rafSchedule(this.handleWindowResize);
}

export const updateRightShadow = (
  wrapper?: HTMLElement | null,
  table?: HTMLElement | null,
  rightShadow?: HTMLElement | null,
) => {
  if (table && wrapper && rightShadow) {
    const diff = table.offsetWidth - wrapper.offsetWidth;
    rightShadow.style.display =
      diff > 0 && diff > wrapper.scrollLeft ? 'block' : 'none';
  }
  return;
};

export default TableComponent;
