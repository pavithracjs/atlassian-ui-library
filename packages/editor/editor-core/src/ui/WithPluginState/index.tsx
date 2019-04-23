import * as React from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { EventDispatcher } from '../../event-dispatcher';
import withEditorViewAndEventDispatcher from './withEditorViewAndEventDispatcher';

/**
 * Remove all editor plugins states that use old event dispatcher architecture
 */
function cleanEditorState(editorPluginStates: { [key: string]: any }) {
  return Object.keys(editorPluginStates).reduce((acc, pluginKey) => {
    const state = editorPluginStates[pluginKey];
    if (!state || state.subscribe) {
      return acc;
    }
    return {
      ...acc,
      [pluginKey]: state,
    };
  }, {});
}

export type PluginsConfig = { [name: string]: PluginKey };

export interface Props {
  eventDispatcher?: EventDispatcher;
  editorView?: EditorView;
  plugins: PluginsConfig;
  render: (pluginsState: any) => React.ReactElement<any> | null;
}

/**
 * Wraps component in a high order component that watches state changes of given plugins
 * and passes those states to the wrapped component.
 *
 * Example:
 * <WithPluginState
 *   eventDispatcher={eventDispatcher}
 *   editorView={editorView}
 *   plugins={{
 *     hyperlink: hyperlinkPluginKey
 *   }}
 *   render={renderComponent}
 * />
 *
 * renderComponent: ({ hyperlink }) => React.Component;
 */
class WithPluginState extends React.Component<Props> {
  private listeners: {
    [pluginKey: string]: { handler(pluginState: any): void; pluginKey: string };
  } = {};
  private debounce: number | null = null;
  private recentEditorPluginState: { [key: string]: any } = {};
  private isSubscribed = false;
  private hasBeenMounted = false;

  /**
   * We use an internal object to map all the editor state, we cannot use react state
   * because we need to debounce the react rendering, related to many updates in
   * editor states. So, when the final React Components is been rendered the state is
   * outdated.
   *
   * We detect if the internal state changed to force a debounce update.
   *
   */
  private handlePluginStateChange = (
    propName: string,
    isPluginWithSubscribe?: boolean,
  ) => (pluginState: any) => {
    if (isPluginWithSubscribe) {
      this.recentEditorPluginState[propName] = pluginState;
      this.debounceForceUpdate();
    } else {
      if (this.recentEditorPluginState[propName] !== pluginState) {
        this.recentEditorPluginState[propName] = pluginState;
        this.debounceForceUpdate();
      }
    }
  };

  /**
   * Debounces forceUpdate.
   */
  private debounceForceUpdate() {
    if (this.debounce) {
      clearTimeout(this.debounce);
    }

    this.debounce = window.setTimeout(() => {
      if (this.hasBeenMounted) {
        this.forceUpdate();
      }
      this.debounce = null;
    }, 10);
  }

  private getPluginsStates(
    plugins: { [name: string]: PluginKey },
    editorView?: EditorView,
  ) {
    if (!editorView || !plugins) {
      return {};
    }

    return Object.keys(plugins).reduce<Record<string, any>>((acc, propName) => {
      const pluginKey = plugins[propName];
      if (!pluginKey) {
        return acc;
      }
      acc[propName] = pluginKey.getState(editorView.state);
      return acc;
    }, {});
  }

  private subscribe(props: Props): void {
    const { eventDispatcher, editorView, plugins } = props;

    if (!eventDispatcher || !editorView || this.isSubscribed) {
      return;
    }

    this.isSubscribed = true;

    const pluginsStates = this.getPluginsStates(plugins, editorView);
    this.setState(pluginsStates);

    Object.keys(plugins).forEach(propName => {
      const pluginKey = plugins[propName];
      if (!pluginKey) {
        return;
      }

      const pluginState = (pluginsStates as any)[propName];
      const isPluginWithSubscribe = pluginState && pluginState.subscribe;
      const handler = this.handlePluginStateChange(
        propName,
        isPluginWithSubscribe,
      );

      if (isPluginWithSubscribe) {
        pluginState.subscribe(handler);
      } else {
        eventDispatcher.on((pluginKey as any).key, handler);
      }

      (this.listeners as any)[(pluginKey as any).key] = { handler, pluginKey };
    });
  }

  private unsubscribe() {
    const { editorView, eventDispatcher } = this.props;

    if (!eventDispatcher || !editorView || !this.isSubscribed) {
      return;
    }

    Object.keys(this.listeners).forEach(key => {
      const pluginState = (this.listeners as any)[key].pluginKey.getState(
        editorView.state,
      );

      if (pluginState && pluginState.unsubscribe) {
        pluginState.unsubscribe((this.listeners as any)[key].handler);
      } else {
        eventDispatcher.off(key, (this.listeners as any)[key].handler);
      }
    });

    this.listeners = {};
  }

  /**
   * Return the most recent editor plugin states, use the stored state for
   * the plugins state with event dispatcher architecture.
   */
  private getMostRecentState() {
    const { plugins, editorView } = this.props;

    const editorPluginStates = cleanEditorState(
      this.getPluginsStates(plugins, editorView),
    );

    return {
      ...this.recentEditorPluginState, // State with non editor plugin states updated
      ...editorPluginStates, // Most recent editor plugin states
    };
  }

  componentDidMount() {
    this.hasBeenMounted = true;
    this.subscribe(this.props);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!this.isSubscribed) {
      this.subscribe(nextProps);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.hasBeenMounted = false;
  }

  render() {
    const { render } = this.props;
    this.recentEditorPluginState = this.getMostRecentState();
    return render(this.recentEditorPluginState);
  }
}

export default withEditorViewAndEventDispatcher<Props>(WithPluginState);
