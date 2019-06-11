import React from 'react';
import { Node as PMNode, DOMSerializer } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';

import { getCurrentUrlWithHash } from '@atlaskit/editor-common';

import { getPosHandler, ForwardRef } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import Heading from './heading';
import {
  SelectionBasedNodeView,
  ReactComponentProps,
  shouldUpdate,
} from '../../../nodeviews/ReactNodeView';
import { copyTextToClipboard } from '..';
import { findChildren } from 'prosemirror-utils';
import {
  DispatchAnalyticsEvent,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  ACTION_SUBJECT_ID,
} from '../../analytics';

export class HeadingNodeView extends SelectionBasedNodeView {
  private dispatchAnalyticsEvent: DispatchAnalyticsEvent;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: getPosHandler,
    portalProviderAPI: PortalProviderAPI,
    dispatchAnalyticsEvent: DispatchAnalyticsEvent,
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

    this.dispatchAnalyticsEvent = dispatchAnalyticsEvent;
  }

  createDomRef() {
    const domRef = super.createDomRef();
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

    return (
      this.node.textContent !== nextNode.textContent ||
      super.viewShouldUpdate(nextNode)
    );
  }

  // compute the current heading anchor id
  currentHeadingId = () => {
    const headingNodeName = this.view.state.doc.type.schema.nodes.heading.name;

    const headingNodes = findChildren(
      this.view.state.doc,
      (node: PMNode): boolean => node.type.name === headingNodeName,
    );

    // find how many duplicated headings are above current heading,
    // And append a number to make it unique.
    const headingIds = [];
    let headingId: string = '';
    for (const { node } of headingNodes) {
      headingId = (node.textContent || '').replace(/ /g, '-');
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
    copyTextToClipboard(getCurrentUrlWithHash(this.currentHeadingId()));

  render(_props: any, forwardRef: ForwardRef) {
    const pos = this.view.state.doc.resolve(this.getPos());

    return (
      <Heading
        headingId={this.currentHeadingId()}
        level={this.node.attrs.level}
        onClick={() => {
          this.dispatchAnalyticsEvent({
            action: ACTION.CLICKED,
            actionSubject: ACTION_SUBJECT.BUTTON,
            actionSubjectId: ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK,
            eventType: EVENT_TYPE.UI,
          });
          return this.copyText();
        }}
        isTopLevelHeading={!pos.depth}
        forwardRef={forwardRef}
      />
    );
  }
}

export default function headingNodeView(
  portalProviderAPI: PortalProviderAPI,
  dispatchAnalyticsEvent: DispatchAnalyticsEvent,
) {
  return (node: PMNode, view: EditorView, getPos: getPosHandler): NodeView =>
    new HeadingNodeView(
      node,
      view,
      getPos,
      portalProviderAPI,
      dispatchAnalyticsEvent,
    ).init();
}
