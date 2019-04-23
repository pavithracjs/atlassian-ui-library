import { mount, ReactWrapper } from 'enzyme';
import * as React from 'react';
import { Plugin, PluginKey, Transaction } from 'prosemirror-state';
import { createEditorFactory, doc, p } from '@atlaskit/editor-test-helpers';
import WithPluginState from '../../../ui/WithPluginState';
import { EditorPlugin } from '../../../types/editor-plugin';
import {
  EventDispatcher,
  createDispatch,
  Dispatch,
} from '../../../event-dispatcher';
import EditorActions from '../../../actions';
import EditorContext from '../../../ui/EditorContext';
import { EditorView } from 'prosemirror-view';

type PluginWrapper = {
  key: PluginKey;
  editorPlugin: EditorPlugin;
  pluginState: any;
  setState: (view: EditorView, state: object) => void;
};

type StateFn = (state: any) => void;

/**
 * Helper function to simulate a prosemirror plugin state
 * using old architecture based on subscribe/unsubscribe
 * methods.
 */
function createProsemirrorSubscribePluginState() {
  const callbacks: Array<StateFn> = [];

  return {
    update: jest.fn((state: any) => {
      callbacks.forEach(cb => cb(state));
    }),
    subscribe: jest.fn((cb: StateFn) => {
      callbacks.push(cb);
    }),
    unsubscribe: jest.fn((cb: StateFn) => {
      const index = callbacks.indexOf(cb);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }),
  };
}
/**
 * Helper to create a editor plugin based on a predefined state,
 * or using old subscribe/unsubscribe architecture
 */
function createPlugin(
  key: PluginKey,
  options: { state?: any; subscribe?: boolean },
): PluginWrapper {
  const { state, subscribe } = options;
  let pluginState = state || {};
  if (subscribe) {
    pluginState = createProsemirrorSubscribePluginState();
  }

  const editorPlugin = {
    pmPlugins() {
      return [
        {
          name: '',
          plugin: () =>
            new Plugin({
              key,
              state: {
                init() {
                  return pluginState;
                },
                apply(tr: Transaction) {
                  const newState = tr.getMeta(key);
                  if (newState) {
                    return newState;
                  }
                  return pluginState;
                },
              },
            }),
        },
      ];
    },
  };

  return {
    key,
    editorPlugin,
    pluginState,
    setState(view: EditorView, state: object) {
      view.dispatch(view.state.tr.setMeta(key, state));
    },
  };
}

const setTimeoutPromise = (cb: Function, delay: number) =>
  new Promise(resolve => window.setTimeout(() => resolve(cb()), delay));

// Utils variables
const emptyState = {};
const fooBarState = { foo: 'bar' };
const barFooState = { bar: 'foo' };

jest.useFakeTimers();
describe('WithPluginState', () => {
  const createEditor = createEditorFactory();
  let eventDispatcher: EventDispatcher;
  let dispatch: Dispatch;
  let editorView: EditorView;
  let wrapper: ReactWrapper;
  let renderMock: jest.MockInstance<React.ReactElement<any>>;
  let pluginWrapper: PluginWrapper;
  let plugin2Wrapper: PluginWrapper;
  let subscribePluginWrapper: PluginWrapper;

  beforeEach(() => {
    // Setup event dispatcher utils
    eventDispatcher = new EventDispatcher();
    dispatch = createDispatch(eventDispatcher);

    // Create Editor Plugins
    pluginWrapper = createPlugin(new PluginKey('plugin'), {
      state: emptyState,
    });
    plugin2Wrapper = createPlugin(new PluginKey('plugin2'), {
      state: emptyState,
    });
    subscribePluginWrapper = createPlugin(new PluginKey('subscriberPlugin'), {
      subscribe: true,
    });

    // Setup editor with custom editor plugins
    ({ editorView } = createEditor({
      doc: doc(p()),
      editorPlugins: [
        pluginWrapper.editorPlugin,
        plugin2Wrapper.editorPlugin,
        subscribePluginWrapper.editorPlugin,
      ],
    }));

    // Create render mock function
    renderMock = jest.fn(() => null);

    // Mount a base with plugin state
    wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{
          pluginState: pluginWrapper.key,
          plugin2State: plugin2Wrapper.key,
          subscribePluginState: subscribePluginWrapper.key,
        }}
        render={renderMock as any}
      />,
    );

    renderMock.mockClear();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }

    if (editorView) {
      editorView.destroy();
    }
  });

  it('should render with current prosemirror plugin state', () => {
    pluginWrapper.setState(editorView, fooBarState);

    wrapper = mount(
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ currentPluginState: pluginWrapper.key }}
        render={renderMock as any}
      />,
    );

    expect(renderMock).toHaveBeenCalledWith({
      currentPluginState: fooBarState,
    });
  });

  it('should update with current prosemirror plugin state', () => {
    dispatch(pluginWrapper.key, fooBarState);
    pluginWrapper.setState(editorView, barFooState);

    jest.runAllTimers();

    // The source of true is prosemirror state, no dispatch.
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pluginState: barFooState,
      }),
    );
  });

  it('should support getting EditorView and EventDispatcher from the context', () => {
    const editorActions = new EditorActions();
    editorActions._privateRegisterEditor(editorView, eventDispatcher);

    wrapper = mount(
      <EditorContext editorActions={editorActions}>
        <WithPluginState
          plugins={{ pluginState: pluginWrapper.key }}
          render={renderMock as any}
        />
      </EditorContext>,
    );

    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        pluginState: pluginWrapper.key.getState(editorView.state),
      }),
    );
  });

  describe('Old Subscribe/Unsubscribe Plugins State Architecture', () => {
    it('should update', () => {
      subscribePluginWrapper.pluginState.update(fooBarState);

      jest.runAllTimers(); // Run debounce timeout

      expect(renderMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ subscribePluginState: fooBarState }),
      );
    });

    it('should retain old plugin state when is updated by event dispatcher', () => {
      // Setup
      subscribePluginWrapper.pluginState.update(fooBarState);
      jest.runAllTimers(); // Run debounce timeout
      renderMock.mockClear();

      dispatch(pluginWrapper.key, {}); // Update using event dispatcher
      jest.runAllTimers(); // Run debounce timeout

      expect(renderMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ subscribePluginState: fooBarState }),
      );
    });
  });

  describe('Debounce update with multiple plugins events dispatch', () => {
    const debounceMilliseconds = 10;
    const lastDispatchMilliseconds = 12;

    beforeEach(() => {
      // Set up multiple event dispatch with different timeouts
      setTimeoutPromise(() => dispatch(pluginWrapper.key, {}), 0);
      setTimeoutPromise(
        () => dispatch(plugin2Wrapper.key, {}),
        lastDispatchMilliseconds,
      );
      setTimeoutPromise(() => dispatch(pluginWrapper.key, {}), 5);
      setTimeoutPromise(() => dispatch(pluginWrapper.key, {}), 0);
      setTimeoutPromise(() => dispatch(plugin2Wrapper.key, {}), 8);
      setTimeoutPromise(() => dispatch(pluginWrapper.key, {}), 5);
    });

    it('should update after debounce time', async () => {
      jest.advanceTimersByTime(lastDispatchMilliseconds + debounceMilliseconds);

      expect(renderMock.mock.calls.length).toEqual(1); // should update when debounce timer
    });

    it('should not update before debounce time', async () => {
      jest.advanceTimersByTime(
        lastDispatchMilliseconds + debounceMilliseconds - 1,
      );

      expect(renderMock.mock.calls.length).toEqual(0); // 1 second after debounce update should not update
    });
  });

  describe('Unmount', () => {
    it('should unsubscribe from event dispatcher', () => {
      const eventDispatcherOff = jest.spyOn(eventDispatcher, 'off');

      const wrapper = mount(
        <WithPluginState
          editorView={editorView}
          eventDispatcher={eventDispatcher}
          plugins={{
            pluginState: pluginWrapper.key,
            plugin2State: plugin2Wrapper.key,
          }}
          render={() => null}
        />,
      );

      wrapper.unmount();

      expect(eventDispatcherOff).toHaveBeenCalledWith(
        (pluginWrapper.key as any).key,
        expect.any(Function),
      );
      expect(eventDispatcherOff).toHaveBeenCalledWith(
        (plugin2Wrapper.key as any).key,
        expect.any(Function),
      );
    });

    it('should unsubscribe for old plugins with subscribe/unsubscribe methods', () => {
      const wrapper = mount(
        <WithPluginState
          editorView={editorView}
          eventDispatcher={eventDispatcher}
          plugins={{ pluginState: subscribePluginWrapper.key }}
          render={() => null}
        />,
      );

      subscribePluginWrapper.pluginState.unsubscribe.mockClear();

      wrapper.unmount();

      expect(
        subscribePluginWrapper.pluginState.unsubscribe,
      ).toHaveBeenCalledTimes(1);
    });
  });
});
