import * as React from 'react';

import { EditorPlugin } from '../../types';
import WithPluginState from '../../ui/WithPluginState';

import { createPlugin, pluginKey } from './plugin';
import { MediaEditorState } from './types';

import { MediaEditor } from './components';

const mediaEditorPlugin: EditorPlugin = {
  pmPlugins() {
    return [{ name: 'mediaEditor', plugin: createPlugin }];
  },

  contentComponent({ editorView, eventDispatcher }) {
    return (
      <WithPluginState
        editorView={editorView}
        plugins={{ mediaEditorState: pluginKey }}
        eventDispatcher={eventDispatcher}
        render={({
          mediaEditorState,
        }: {
          mediaEditorState: MediaEditorState;
        }) => (
          <MediaEditor mediaEditorState={mediaEditorState} view={editorView} />
        )}
      />
    );
  },
};

export default mediaEditorPlugin;
