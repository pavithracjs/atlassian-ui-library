import * as React from 'react';
import { Node, Mark } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import {
  setLinkText,
  removeLink,
  hideLinkToolbar,
  setLinkHref,
  insertLink,
} from '../commands';
import HyperlinkEdit from './HyperlinkEdit';
import { findDomRefAtPos } from 'prosemirror-utils';
import { ActivityProvider } from '@atlaskit/activity';
import RecentSearch from './RecentSearch';

export class AddLinkDisplayTextToolbar extends React.PureComponent<{
  pos: number;
  node: Node;
  view: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}> {
  render() {
    const {
      pos,
      node,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
    } = this.props;
    const existingLink = (node.type.schema.marks.link.isInSet(
      node.marks,
    ) as Mark).attrs.href;
    const unlink = () => removeLink(pos)(view.state, view.dispatch, view);
    const hideToolbar = () =>
      hideLinkToolbar()(view.state, view.dispatch, view);
    const updateLinkText = text =>
      setLinkText(pos, text)(view.state, view.dispatch, view);
    const updateLinkTextOrElse = text => updateLinkText(text) || hideToolbar();
    return (
      <HyperlinkEdit
        target={findDomRefAtPos(pos, view.domAtPos.bind(view))}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        alwaysOpenLinkAt={existingLink}
        placeholder="Text to display"
        onSubmit={updateLinkText}
        onBlur={updateLinkTextOrElse}
        onUnlink={unlink}
        onOpenLink={() => {}}
      />
    );
  }
}

export class EditLinkHrefToolbar extends React.PureComponent<{
  pos: number;
  node: Node;
  view: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}> {
  render() {
    const {
      pos,
      node,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
    } = this.props;
    const existingLink = (node.type.schema.marks.link.isInSet(
      node.marks,
    ) as Mark).attrs.href;
    const hideToolbar = () =>
      hideLinkToolbar()(view.state, view.dispatch, view);
    const updateLinkHref = href =>
      setLinkHref(pos, href)(view.state, view.dispatch, view);
    const updateLinkHrefOrElse = href => updateLinkHref(href) || hideToolbar();
    const unlink = () => removeLink(pos)(view.state, view.dispatch, view);
    return (
      <HyperlinkEdit
        target={findDomRefAtPos(pos, view.domAtPos.bind(view))}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        defaultValue={existingLink}
        placeholder="Paste link"
        onSubmit={updateLinkHref}
        onBlur={updateLinkHrefOrElse}
        onUnlink={unlink}
        onOpenLink={() => {}}
      />
    );
  }
}

export class InsertLinkToolbar extends React.PureComponent<{
  from: number;
  to: number;
  view: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}> {
  render() {
    const {
      from,
      to,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
    } = this.props;
    const hideToolbar = () =>
      hideLinkToolbar()(view.state, view.dispatch, view);
    const addLink = (href: string) =>
      insertLink(from, to, href)(view.state, view.dispatch, view);
    return (
      <HyperlinkEdit
        target={findDomRefAtPos(from, view.domAtPos.bind(view))}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        autoFocus={true}
        placeholder="Paste link"
        onSubmit={addLink}
        onBlur={hideToolbar}
      />
    );
  }
}

export class ActivityPoweredInsertLinkToolbar extends React.PureComponent<{
  from: number;
  to: number;
  view: EditorView;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  activityProvider: Promise<ActivityProvider>;
}> {
  render() {
    const {
      from,
      to,
      view,
      popupsMountPoint,
      popupsBoundariesElement,
      activityProvider,
    } = this.props;
    const hideToolbar = () =>
      hideLinkToolbar()(view.state, view.dispatch, view);
    const addLink = (href: string, text?: string) =>
      insertLink(from, to, href, text)(view.state, view.dispatch, view);
    return (
      <RecentSearch
        target={findDomRefAtPos(from, view.domAtPos.bind(view))}
        popupsMountPoint={popupsMountPoint}
        popupsBoundariesElement={popupsBoundariesElement}
        autoFocus={true}
        activityProvider={activityProvider}
        placeholder="Paste link or search recently viewed"
        onSubmit={addLink}
        onBlur={hideToolbar}
      />
    );
  }
}
