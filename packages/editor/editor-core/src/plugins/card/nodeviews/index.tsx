import { ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import {
  ReactComponentProps,
  getPosHandler,
} from '../../../nodeviews/ReactNodeView';
import { Node } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { SelectableCard, Card } from './genericCard';
import UnsupportedInlineNode from '../../unsupported-content/nodeviews/unsupported-inline';
import { InlineCard } from './inlineCard';
import { BlockCard } from './blockCard';
import wrapComponentWithClickArea from '../../../nodeviews/legacy-nodeview-factory/ui/wrapper-click-area';
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

const ClickableInlineCard = wrapComponentWithClickArea(
  Card(UnsupportedInlineNode, InlineCard),
);
export const InlineCardNodeView = SelectableCard(ClickableInlineCard);

const ClickableBlockCard = wrapComponentWithClickArea(
  Card(UnsupportedBlockNode, BlockCard),
);
export const BlockCardNodeView = SelectableCard(ClickableBlockCard);
