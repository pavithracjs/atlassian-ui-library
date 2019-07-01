import { Plugin, PluginKey, PluginSpec } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common';

import { PMPluginFactoryParams } from '../../../types';

import { pluginFactory } from '../../../utils/plugin-state-factory';
import { MediaEditorState, MediaEditorAction } from '../types';
import { MediaProvider } from '../types';
import { setMediaClientConfig } from '../commands/media-editor';
import {
  getUploadMediaClientConfigFromMediaProvider,
  getViewMediaClientConfigFromMediaProvider,
} from '../utils/media-common';

export const pluginKey = new PluginKey('mediaEditorPlugin');

export const reducer = (
  state: MediaEditorState,
  action: MediaEditorAction,
): MediaEditorState => {
  switch (action.type) {
    case 'open':
      return {
        ...state,
        editor: {
          identifier: action.identifier,
          pos: action.pos,
        },
      };
    case 'close':
      return {
        ...state,
        editor: undefined,
      };
    case 'upload':
      return {
        ...state,
        editor: undefined,
      };
    case 'setMediaClientConfig':
      return {
        ...state,
        mediaClientConfig: action.mediaClientConfig,
      };
    default:
      return state;
  }
};

// handle mapping changes to providers -> plugin state
const pluginView = (
  providerFactory: ProviderFactory,
): PluginSpec['view'] => view => {
  const updateMediaProvider = async (
    name: string,
    provider?: Promise<MediaProvider>,
  ) => {
    if (name !== 'mediaProvider') {
      return;
    }

    const resolvedProvider = await provider;
    if (!resolvedProvider) {
      return;
    }

    const resolvedMediaClientConfig =
      (await getUploadMediaClientConfigFromMediaProvider(resolvedProvider)) ||
      (await getViewMediaClientConfigFromMediaProvider(resolvedProvider));

    const { dispatch, state } = view;
    setMediaClientConfig(resolvedMediaClientConfig)(state, dispatch, view);
  };

  providerFactory.subscribe('mediaProvider', updateMediaProvider);

  return {
    destroy() {
      providerFactory.unsubscribe('mediaProvider', updateMediaProvider);
    },
  };
};

const { createPluginState, createCommand, getPluginState } = pluginFactory(
  pluginKey,
  reducer,
  {
    mapping: (tr, state) => {
      if (!state.editor) {
        return state;
      }

      // remap the position of the editing media inside the state
      return {
        ...state,
        editor: {
          ...state.editor,
          pos: tr.mapping.map(state.editor.pos),
        },
      };
    },
  },
);

export const createPlugin = ({
  dispatch,
  providerFactory,
}: PMPluginFactoryParams) => {
  return new Plugin({
    state: createPluginState(dispatch, {}),
    key: pluginKey,
    view: pluginView(providerFactory),
  });
};

export { createCommand, getPluginState };
