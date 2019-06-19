import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import {
  pluginKey as widthPluginKey,
  WidthPluginState,
} from '../../plugins/width';
import { WidthConsumer } from '@atlaskit/editor-common';

export interface Props {
  editorView: EditorView;
  contentArea?: HTMLElement | null;
}

export default class WidthEmitter extends Component<Props> {
  private debounce: number | null = null;

  render() {
    return (
      <WidthConsumer>{({ width }) => this.broadcastWidth(width)}</WidthConsumer>
    );
  }

  private broadcastWidth = (width: number) => {
    const { editorView } = this.props;
    if (!editorView) {
      return null;
    }

    const widthPluginState: WidthPluginState = widthPluginKey.getState(
      editorView.state,
    );
    if (editorView && widthPluginState.width !== width) {
      if (this.debounce) {
        clearTimeout(this.debounce);
      }

      // NodeViews will trigger multiple state change error without this debounce
      this.debounce = window.setTimeout(() => {
        const pmDom = this.props.contentArea
          ? this.props.contentArea.querySelector('.ProseMirror')
          : undefined;
        const tr = editorView.state.tr.setMeta(widthPluginKey, {
          width,
          lineLength: pmDom ? pmDom.clientWidth : undefined,
        });

        editorView.dispatch(tr);
        this.debounce = null;
      }, 10);
    }
    return null;
  };
}
