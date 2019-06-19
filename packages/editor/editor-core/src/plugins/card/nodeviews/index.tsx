import { ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import {
  ReactComponentProps,
  getPosHandler,
} from '../../../nodeviews/ReactNodeView';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Card } from './genericCard';
import UnsupportedInlineNode from '../../unsupported-content/nodeviews/unsupported-inline';
import { InlineCard } from './inlineCard';
import { BlockCard } from './blockCard';
import wrapComponentWithClickArea, {
  applySelectionAsProps,
} from '../../../nodeviews/legacy-nodeview-factory/ui/wrapper-click-area';
import UnsupportedBlockNode from '../../unsupported-content/nodeviews/unsupported-block';

export class CardNodeView extends ReactNodeView {
  static fromComponent(
    component: React.ComponentType<any>,
    portalProviderAPI: PortalProviderAPI,
    props?: ReactComponentProps,
  ) {
    return (node: Node, view: EditorView, getPos: getPosHandler) =>
      new CardNodeView(
        node,
        view,
        getPos,
        portalProviderAPI,
        props,
        component,
        true,
      ).init();
  }
}

export const InlineCardNodeView = applySelectionAsProps(
  wrapComponentWithClickArea(Card(UnsupportedInlineNode, InlineCard), true),
);

export const BlockCardNodeView = applySelectionAsProps(
  wrapComponentWithClickArea(Card(UnsupportedBlockNode, BlockCard)),
);
