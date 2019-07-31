import React from 'react';
import { Node as PMNode, DOMSerializer } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';

import { getCurrentUrlWithoutHash } from '@atlaskit/editor-common/src/utils/urls';
import { getText } from '@atlaskit/renderer/src/utils';

import { getPosHandler, ForwardRef } from '../../../nodeviews';
import { createMobileInlineDomRef } from '../../../ui/InlineNodeWrapper';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import Heading from './heading';
import {
  SelectionBasedNodeView,
  ReactComponentProps,
  shouldUpdate,
} from '../../../nodeviews/ReactNodeView';

import { hasParentNodeOfType, findChildren } from 'prosemirror-utils';
import { copyTextToClipboard } from '..';

import { Selection } from 'prosemirror-state';

export class HeadingNodeView extends SelectionBasedNodeView {
  private oldHeadingContent: string;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: getPosHandler,
    portalProviderAPI: PortalProviderAPI,
    reactComponentProps: ReactComponentProps = {},
    reactComponent?: React.ComponentType<any>,
    hasContext: boolean = false,
    viewShouldUpdate?: shouldUpdate,
  ) {
    super(
      node,
      view,
      getPos,
      portalProviderAPI,
      reactComponentProps,
      reactComponent,
      hasContext,
      viewShouldUpdate,
    );

    this.oldHeadingContent = node.content.toString();
  }

  createDomRef() {
    const domRef =
      this.reactComponentProps.editorAppearance === 'mobile'
        ? createMobileInlineDomRef()
        : super.createDomRef();

    domRef.classList.add('fabric-editor-block-mark');
    return domRef;
  }

  getContentDOM() {
    return DOMSerializer.renderSpec(document, ['div', 0]);
  }

  viewShouldUpdate(nextNode: PMNode) {
    if (nextNode.attrs !== this.node.attrs) {
      return true;
    }

    const oldHeadingContent = this.oldHeadingContent;
    const headingContent = nextNode.content.toString();
    this.oldHeadingContent = headingContent;

    return (
      oldHeadingContent !== headingContent || super.viewShouldUpdate(nextNode)
    );
  }

  createHeadingId = (node: PMNode) =>
    (node.content.toJSON() || [])
      .reduce((acc: string, node: any) => acc.concat(getText(node) || ''), '')
      .replace(/ /g, '-');

  currentHeadingId = () => {
    const headingNodes = findChildren(
      this.view.state.doc,
      (node: PMNode): boolean =>
        node.type.name === this.view.state.doc.type.schema.nodes.heading.name,
    );

    const headingIds = [];
    let headingId: string = '';

    for (const { node } of headingNodes) {
      headingId = this.createHeadingId(node);
      if (node === this.node) {
        const count = headingIds.filter(item => item === headingId).length;
        if (count) {
          headingId = `${headingId}.${count}`;
        }
        break;
      } else {
        headingIds.push(headingId);
      }
    }

    return headingId;
  };

  copyText = (): Promise<void> =>
    copyTextToClipboard(
      `${getCurrentUrlWithoutHash()}#${encodeURIComponent(
        this.currentHeadingId(),
      )}`,
    );

  render(_props: any, forwardRef: ForwardRef) {
    const {
      schema: {
        nodes: {
          panel,
          table,
          tableRow,
          tableHeader,
          layoutSection,
          layoutColumn,
          extension,
          bodiedExtension,
        },
      },
    } = this.view.state;

    const pos = this.view.state.doc.resolve(this.getPos());
    const hasUnsupportedParentType = hasParentNodeOfType([
      panel,
      table,
      tableRow,
      tableHeader,
      layoutSection,
      layoutColumn,
      extension,
      bodiedExtension,
    ])(new Selection(pos, pos));

    return (
      <Heading
        headingId={this.currentHeadingId()}
        level={this.node.attrs.level}
        onClick={this.copyText}
        isTopLevelHeading={!hasUnsupportedParentType}
        forwardRef={forwardRef}
      />
    );
  }
}

export default function headingNodeView(portalProviderAPI: PortalProviderAPI) {
  return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new HeadingNodeView(node, view, getPos, portalProviderAPI).init();
}
