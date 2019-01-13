import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { Node as PmNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { setCellAttrs } from '@atlaskit/adf-schema';
import { findDomRefAtPos } from 'prosemirror-utils';
import Button from '@atlaskit/button';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import ReactNodeView from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import ToolbarButton from '../../../ui/ToolbarButton';
import WithPluginState from '../../../ui/WithPluginState';
import messages from '../ui/messages';
import { pluginKey } from '../pm-plugins/main';
import {
  pluginKey as tableResizingPluginKey,
  ResizeState,
} from '../pm-plugins/table-resizing/index';
import {
  pluginKey as columnTypesPluginKey,
  getCellTypeIcon,
} from '../pm-plugins/column-types';
import { toggleContextualMenu } from '../actions';
import { TableCssClassName as ClassName, TablePluginState } from '../types';
import { EditorAppearance } from '../../../types';
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
  appearance?: EditorAppearance;
}

export type CellProps = {
  view: EditorView;
  node: PmNode;
  forwardRef: (ref: HTMLElement | null) => void;
  withCursor: boolean;
  isResizing?: boolean;
  isContextualMenuOpen: boolean;
  disabled: boolean;
  appearance?: EditorAppearance;
  getPos: () => number;
  columnIndex?: number;
};

class Cell extends React.Component<CellProps & InjectedIntlProps> {
  // shouldComponentUpdate(nextProps) {
  //   return (
  //     this.props.withCursor !== nextProps.withCursor ||
  //       this.props.isResizing !== nextProps.isResizing ||
  //       this.props.isContextualMenuOpen !== nextProps.isContextualMenuOpen,
  //     this.props.columnIndex !== nextProps.columnIndex ||
  //       this.props.node.attrs.cellType !== nextProps.node.attrs.cellType
  //   );
  // }

  render() {
    const {
      withCursor,
      isResizing,
      isContextualMenuOpen,
      forwardRef,
      intl: { formatMessage },
      disabled,
      appearance,
      view: {
        state: { schema },
      },
      node,
    } = this.props;
    const labelCellOptions = formatMessage(messages.cellOptions);

    return (
      <div className={ClassName.CELL_NODEVIEW_WRAPPER}>
        <div className={ClassName.CELL_NODEVIEW_CONTENT} ref={forwardRef}>
          {withCursor && !disabled && appearance !== 'mobile' && (
            <div className={ClassName.CONTEXTUAL_MENU_BUTTON}>
              <ToolbarButton
                disabled={isResizing}
                selected={isContextualMenuOpen}
                title={labelCellOptions}
                onClick={this.toggleContextualMenu}
                iconBefore={<ExpandIcon label={labelCellOptions} />}
              />
            </div>
          )}
        </div>
        {node.type === schema.nodes.tableHeader && (
          <div className={ClassName.CELL_NODEVIEW_COLUMN_TYPES_BUTTON}>
            <Button
              appearance="subtle"
              iconBefore={getCellTypeIcon(node.attrs.cellType)}
              spacing="none"
              onClick={this.toggleCellTypeMenu}
              isSelected={this.isColumnTypeMenuOpen()}
            />
          </div>
        )}
      </div>
    );
  }
  private isColumnTypeMenuOpen = (): boolean => {
    const pos = this.props.getPos();
    if (pos) {
      const { columnIndex, view } = this.props;
      const cell = findDomRefAtPos(
        pos,
        view.domAtPos.bind(view),
      ) as HTMLTableDataCellElement;
      return (
        typeof columnIndex !== 'undefined' && cell.cellIndex === columnIndex
      );
    }
    return false;
  };

  private toggleContextualMenu = () => {
    const { state, dispatch } = this.props.view;
    toggleContextualMenu(state, dispatch);
  };

  private toggleCellTypeMenu = (event: React.SyntheticEvent) => {
    const { dispatch, state } = this.props.view;
    const target = event.target as HTMLElement;
    const ref = closestElement(target, 'th') as HTMLTableDataCellElement;
    const columnIndex = ref ? ref.cellIndex : undefined;
    const targetCellPosition = this.props.getPos();
    if (targetCellPosition) {
      dispatch(
        state.tr.setMeta(columnTypesPluginKey, {
          isMenuOpen: true,
          targetCellPosition,
          columnIndex,
        }),
      );
    }
  };
}

const CellComponent = injectIntl(Cell);

class CellView extends ReactNodeView {
  private cell: HTMLElement | undefined;

  constructor(props: CellViewProps) {
    super(props.node, props.view, props.getPos, props.portalProviderAPI, props);
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

  setDomAttrs(node) {
    const { cell } = this;
    if (cell) {
      const attrs = setCellAttrs(node, cell);
      Object.keys(attrs).forEach(attr => {
        cell.setAttribute(attr, attrs[attr]);
      });
    }
  }

  render(props, forwardRef) {
    // nodeview does not re-render on selection changes
    // so we trigger render manually to hide/show contextual menu button when `targetCellPosition` is updated
    return (
      <WithPluginState
        plugins={{
          pluginState: pluginKey,
          tableResizingPluginState: tableResizingPluginKey,
          columnTypesState: columnTypesPluginKey,
          editorDisabledPlugin: editorDisabledPluginKey,
        }}
        editorView={props.view}
        render={({
          pluginState,
          tableResizingPluginState,
          columnTypesState,
          editorDisabledPlugin,
        }: {
          pluginState: TablePluginState;
          tableResizingPluginState: ResizeState;
          editorDisabledPlugin: EditorDisabledPluginState;
        }) => (
          <CellComponent
            forwardRef={forwardRef}
            withCursor={this.getPos() === pluginState.targetCellPosition}
            isResizing={
              !!tableResizingPluginState && !!tableResizingPluginState.dragging
            }
            isContextualMenuOpen={!!pluginState.isContextualMenuOpen}
            columnIndex={columnTypesState.columnIndex}
            view={props.view}
            node={this.node}
            getPos={this.getPos}
            appearance={props.appearance}
            disabled={(editorDisabledPlugin || {}).editorDisabled}
          />
        )}
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
  appearance?: EditorAppearance,
) => (node, view, getPos): NodeView => {
  return new CellView({
    node,
    view,
    getPos,
    portalProviderAPI,
    appearance,
  }).init();
};
