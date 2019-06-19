import * as React from 'react';
import { PureComponent, ComponentClass, StatelessComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import styled from 'styled-components';
import {
  ReactNodeViewState,
  stateKey as reactNodeViewPlugin,
} from '../../../plugins/base/pm-plugins/react-nodeview';
import { setNodeSelection } from '../../../utils';
import { ProsemirrorGetPosHandler } from '../../types';

export interface ReactNodeViewComponents {
  [key: string]: ComponentClass<any> | StatelessComponent<any>;
}

export interface ClickWrapperProps {
  getPos: ProsemirrorGetPosHandler;
  pluginState: ReactNodeViewState;
  view: EditorView;

  onSelection?: (selected: boolean) => void;
}

const BlockWrapper = styled.div`
  width: 100%;
`;
BlockWrapper.displayName = 'BlockWrapperClickArea';

const InlineWrapper = styled.span``;
InlineWrapper.displayName = 'InlineWrapperClickArea';

interface State {
  selected: boolean;
}

export default function wrapComponentWithClickArea<
  T extends Partial<ClickWrapperProps> & { selected: boolean }
>(
  ReactComponent: React.ComponentType<T>,
  inline?: boolean,
): React.ComponentClass<T & ClickWrapperProps> {
  return class WrapperClickArea extends PureComponent<
    T & ClickWrapperProps,
    State
  > {
    state: State = { selected: false };

    componentDidMount() {
      const { pluginState } = this.props;
      pluginState.subscribe(this.handleDocumentSelectionChange);
    }

    componentWillUnmount() {
      const { pluginState } = this.props;
      pluginState.unsubscribe(this.handleDocumentSelectionChange);
    }

    render() {
      const Wrapper = inline ? InlineWrapper : BlockWrapper;
      return (
        <Wrapper onClick={this.onClick}>
          <ReactComponent {...this.props} selected={this.state.selected} />
        </Wrapper>
      );
    }

    private handleDocumentSelectionChange = (
      fromPos: number,
      toPos: number,
    ) => {
      const { getPos, onSelection } = this.props;
      const nodePos = getPos();

      const selected = nodePos >= fromPos && nodePos < toPos;

      const oldSelected = this.state.selected;
      this.setState({ selected }, () => {
        if (onSelection && selected !== oldSelected) {
          onSelection(selected);
        }
      });
    };

    private onClick = () => {
      const { getPos, view } = this.props;
      setNodeSelection(view, getPos());
    };
  };
}

export function applySelectionAsProps<T extends ClickWrapperProps>(
  Component: React.ComponentType<T>,
) {
  return class extends React.PureComponent<T, {}> {
    render() {
      return (
        <Component
          {...this.props}
          pluginState={reactNodeViewPlugin.getState(this.props.view.state)}
        />
      );
    }
  };
}
