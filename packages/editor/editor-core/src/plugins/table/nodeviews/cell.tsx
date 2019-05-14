import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { setCellAttrs } from '@atlaskit/adf-schema';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import {
  ForwardRef,
  SelectionBasedNodeView,
} from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import ToolbarButton from '../../../ui/ToolbarButton';
import messages from '../ui/messages';
import { pluginKey } from '../pm-plugins/main';
import {
  pluginKey as tableResizingPluginKey,
  ResizeState,
} from '../pm-plugins/table-resizing';
import { toggleContextualMenu } from '../commands';
import { TableCssClassName as ClassName, TablePluginState } from '../types';
import { closestElement } from '../../../utils';
import {
  EditorDisabledPluginState,
  pluginKey as editorDisabledPluginKey,
} from '../../editor-disabled';

export interface CellViewProps {
  node: PmNode;
  view: EditorView;
  portalProviderAPI: PortalProviderAPI;
  getPos: () => number;
  isContextMenuEnabled?: boolean;
}

export type CellProps = {
  view: EditorView;
  forwardRef: (ref: HTMLElement | null) => void;
  withCursor: boolean;
  isResizing?: boolean;
  isContextualMenuOpen: boolean;
  disabled: boolean;
  isContextMenuEnabled?: boolean;
};

class Cell extends React.Component<CellProps & InjectedIntlProps> {
  render() {
    const {
      withCursor,
      isResizing,
      isContextualMenuOpen,
      forwardRef,
      intl: { formatMessage },
      disabled,
      isContextMenuEnabled,
    } = this.props;
    const labelCellOptions = formatMessage(messages.cellOptions);
    return (
      <div className={ClassName.CELL_NODEVIEW_WRAPPER} ref={forwardRef}>
        {isContextMenuEnabled && withCursor && !disabled && (
          <div className={ClassName.CONTEXTUAL_MENU_BUTTON_WRAP}>
            <ToolbarButton
              className={ClassName.CONTEXTUAL_MENU_BUTTON}
              disabled={isResizing}
              selected={isContextualMenuOpen}
              title={labelCellOptions}
              onClick={this.handleClick}
              iconBefore={<ExpandIcon label={labelCellOptions} />}
            />
          </div>
        )}
      </div>
    );
  }

  private handleClick = () => {
    const { state, dispatch } = this.props.view;
    toggleContextualMenu()(state, dispatch);
  };
}

const CellComponent = injectIntl(Cell);

class CellView extends SelectionBasedNodeView {
  private cell: HTMLElement | undefined;
  private oldTableState: TablePluginState;

  constructor(props: CellViewProps) {
    super(props.node, props.view, props.getPos, props.portalProviderAPI, props);
    this.oldTableState = pluginKey.getState(props.view.state);
  }

  createDomRef() {
    const { tableCell } = this.view.state.schema.nodes;
    this.cell = document.createElement(
      `t${this.node.type === tableCell ? 'd' : 'h'}`,
    );
    return this.cell;
  }

  getContentDOM() {
    const dom = document.createElement('div');
    dom.className = ClassName.TABLE_CELL_NODEVIEW_CONTENT_DOM;
    return { dom };
  }

  setDomAttrs(node: PmNode) {
    const { cell } = this;
    if (cell) {
      const attrs = setCellAttrs(node, cell);
      (Object.keys(attrs) as Array<keyof typeof attrs>).forEach(attr => {
        let attrValue = attrs[attr];
        cell.setAttribute(attr, String(attrValue));
      });
    }
  }

  viewShouldUpdate(nextNode: PmNode) {
    const tableState: TablePluginState = pluginKey.getState(this.view.state);
    const tableResizingState: ResizeState = tableResizingPluginKey.getState(
      this.view.state,
    );
    const disabledState: EditorDisabledPluginState = editorDisabledPluginKey.getState(
      this.view.state,
    );
    const oldTableState = this.oldTableState;
    this.oldTableState = tableState;

    if (
      nextNode.attrs !== this.node.attrs ||
      oldTableState.isContextualMenuOpen !== tableState.isContextualMenuOpen ||
      (oldTableState.editorHasFocus !== tableState.editorHasFocus &&
        tableState.isContextualMenuOpen)
    ) {
      return true;
    }

    if (
      (tableResizingState && tableResizingState.dragging) ||
      (disabledState && disabledState.editorDisabled)
    ) {
      return false;
    }

    return super.viewShouldUpdate(nextNode);
  }

  render(props: CellViewProps, forwardRef: ForwardRef) {
    const tableState: TablePluginState = pluginKey.getState(this.view.state);
    const tableResizingState: ResizeState = tableResizingPluginKey.getState(
      this.view.state,
    );
    const disabledState: EditorDisabledPluginState = editorDisabledPluginKey.getState(
      this.view.state,
    );

    return (
      <CellComponent
        forwardRef={forwardRef}
        withCursor={this.insideSelection() && !!tableState.editorHasFocus}
        isResizing={!!tableResizingState && !!tableResizingState.dragging}
        isContextualMenuOpen={!!tableState.isContextualMenuOpen}
        isContextMenuEnabled={props.isContextMenuEnabled}
        view={props.view}
        disabled={(disabledState || {}).editorDisabled}
      />
    );
  }

  ignoreMutation(record: MutationRecord) {
    // @see https://github.com/ProseMirror/prosemirror/issues/862
    const target = record.target as HTMLElement;
    if (
      record.attributeName === 'class' ||
      (target && closestElement(target, `.${ClassName.CELL_NODEVIEW_WRAPPER}`))
    ) {
      return true;
    }
    return false;
  }
}

export const createCellView = (
  portalProviderAPI: PortalProviderAPI,
  isContextMenuEnabled?: boolean,
) => (node: PmNode, view: EditorView, getPos: () => number): NodeView => {
  return new CellView({
    node,
    view,
    getPos,
    portalProviderAPI,
    isContextMenuEnabled,
  }).init();
};
