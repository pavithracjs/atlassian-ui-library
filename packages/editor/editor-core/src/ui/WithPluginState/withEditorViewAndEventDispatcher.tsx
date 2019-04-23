import * as React from 'react';
import * as PropTypes from 'prop-types';
import { EventDispatcher } from '../../event-dispatcher';
import { EditorActions } from '../..';
import { EditorView } from 'prosemirror-view';

export interface WithEditorViewAndEventDispatcherProps {
  editorView?: EditorView;
  eventDispatcher?: EventDispatcher;
}
export type Context = {
  editorActions?: EditorActions;
};
/**
 * HOC to pass the valid editor view or event dispatcher from props or context
 *
 */
export default function withEditorViewAndEventDispatcher<
  P extends WithEditorViewAndEventDispatcherProps
>(Component: React.ComponentType<P>) {
  return class WithEditorViewAndEventDispatcher extends React.Component<P> {
    static contextTypes = {
      editorActions: PropTypes.object,
    };
    context: Context;

    getEditorView() {
      return (
        (this.props && this.props.editorView) ||
        (this.context &&
          this.context.editorActions &&
          this.context.editorActions._privateGetEditorView())
      );
    }

    getEventDispatcher(): EventDispatcher | undefined {
      return (
        (this.props && this.props.eventDispatcher) ||
        (this.context &&
          this.context.editorActions &&
          this.context.editorActions._privateGetEventDispatcher())
      );
    }

    onContextUpdate = () => {
      this.forceUpdate();
    };

    componentDidMount() {
      if (this.context && this.context.editorActions) {
        this.context.editorActions._privateSubscribe(this.onContextUpdate);
      }
    }

    componentWillUnmount() {
      if (this.context && this.context.editorActions) {
        this.context.editorActions._privateUnsubscribe(this.onContextUpdate);
      }
    }

    render() {
      return (
        <Component
          {...this.props}
          editorView={this.getEditorView()}
          eventDispatcher={this.getEventDispatcher()}
        />
      );
    }
  };
}
