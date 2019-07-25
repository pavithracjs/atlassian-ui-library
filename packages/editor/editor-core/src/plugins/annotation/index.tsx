import * as React from 'react';
import { annotation, annotationQuery } from '@atlaskit/adf-schema';
import { Mark } from 'prosemirror-model';
import { findDomRefAtPos } from 'prosemirror-utils';

import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';

import {
  insertInlineCommentAtCurrentPos,
  removeInlineCommentAtCurrentPos,
  removeAnnotationQueryMark,
} from './commands';

import createPlugin, {
  pluginKey,
  AnnotationPluginState,
} from './pm-plugins/main';

import getToolbarConfig from './toolbar';
import { AnnotationToolbarStateName } from './types';

export { AnnotationProvider } from './types';

const annotationPlugin = (): EditorPlugin => ({
  marks() {
    return [
      {
        name: 'annotation',
        mark: annotation,
      },
      {
        name: 'annotationQuery',
        mark: annotationQuery,
      },
    ];
  },

  pmPlugins() {
    return [
      {
        name: 'annotationPlugin',
        plugin: ({ dispatch, props }) =>
          createPlugin(dispatch, props.UNSAFE_annotationProvider!),
      },
    ];
  },

  contentComponent({ editorView }) {
    return (
      <WithPluginState
        plugins={{
          pluginState: pluginKey,
        }}
        render={({ pluginState }: { pluginState: AnnotationPluginState }) => {
          const { activeText } = pluginState;

          let markerRef: string | undefined;
          let dom: HTMLElement | undefined;

          if (
            pluginState.toolbarState &&
            pluginState.toolbarState.type ===
              AnnotationToolbarStateName.EDIT_ANNOTATION_TOOLBAR
          ) {
            const annotation = pluginState.toolbarState.node.marks.find(
              (mark: Mark) => mark.attrs.annotationType === 'inlineComment',
            );
            markerRef = annotation && annotation.attrs.id;
          }

          if (pluginState.toolbarState || pluginState.showComponent) {
            dom = findDomRefAtPos(
              editorView.state.selection.from,
              editorView.domAtPos.bind(editorView),
            ) as HTMLElement;
          }

          return pluginState.component ? (
            <pluginState.component
              markerRef={markerRef}
              textSelection={activeText}
              dom={dom}
              onSuccess={(id: string) => {
                insertInlineCommentAtCurrentPos(id)(
                  editorView.state,
                  editorView.dispatch,
                );
              }}
              onDelete={() =>
                removeInlineCommentAtCurrentPos()(
                  editorView.state,
                  editorView.dispatch,
                )
              }
              onCancel={() =>
                removeAnnotationQueryMark()(
                  editorView.state,
                  editorView.dispatch,
                )
              }
            />
          ) : null;
        }}
      />
    );
  },

  pluginsOptions: {
    floatingToolbar: getToolbarConfig,
  },
});

export default annotationPlugin;
