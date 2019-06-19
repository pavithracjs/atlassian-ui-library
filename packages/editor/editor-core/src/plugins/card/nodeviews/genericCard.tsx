import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Node as PMNode } from 'prosemirror-model';

import { EditorView } from 'prosemirror-view';
import { ClickWrapperProps } from '../../../nodeviews/legacy-nodeview-factory/ui/wrapper-click-area';
import { stateKey as ReactNodeViewState } from '../../../plugins/base/pm-plugins/react-nodeview';
import { Context as SmartCardContext } from '@atlaskit/smart-card';

type EditorContext<T> = React.Context<T> & { value: T };

export interface CardProps {
  children?: React.ReactNode;
  node: PMNode;
  getPos: () => number;
  view: EditorView;
  selected?: boolean;
}

export interface SmartCardProps extends CardProps {
  cardContext: EditorContext<typeof SmartCardContext>;
}

export const Card = (
  UnsupportedComponent: React.ComponentType,
  SmartCardComponent: React.ComponentType<SmartCardProps>,
) =>
  class extends React.PureComponent<CardProps> {
    static contextTypes = {
      contextAdapter: PropTypes.object,
    };

    state = {
      isError: false,
    };

    render() {
      if (this.state.isError) {
        const { url } = this.props.node.attrs;
        if (url) {
          return (
            <a
              href={url}
              onClick={e => {
                e.preventDefault();
              }}
            >
              {url}
            </a>
          );
        } else {
          return <UnsupportedComponent />;
        }
      }

      const cardContext = this.context.contextAdapter
        ? this.context.contextAdapter.card
        : undefined;

      return <SmartCardComponent cardContext={cardContext} {...this.props} />;
    }

    componentDidCatch(_error: Error) {
      this.setState({ isError: true });
    }
  };

export const SelectableCard = (
  ClickableCard: React.ComponentType<CardProps & ClickWrapperProps>,
) =>
  class extends React.PureComponent<CardProps, {}> {
    render() {
      return (
        <ClickableCard
          {...this.props}
          pluginState={ReactNodeViewState.getState(this.props.view.state)}
        />
      );
    }
  };
