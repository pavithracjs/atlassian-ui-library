import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Context as SmartCardContext } from '@atlaskit/smart-card';

import { ClickWrapperProps } from '../../../nodeviews/legacy-nodeview-factory/ui/wrapper-click-area';

type EditorContext<T> = React.Context<T> & { value: T };

export interface CardProps extends Partial<ClickWrapperProps> {
  children?: React.ReactNode;
  node: PMNode;
  selected: boolean;
  view: EditorView;
}

export interface SmartCardProps extends CardProps {
  cardContext?: EditorContext<typeof SmartCardContext>;
}

export function Card(
  SmartCardComponent: React.ComponentType<SmartCardProps>,
  UnsupportedComponent: React.ComponentType,
): React.ComponentType<CardProps> {
  return class extends React.PureComponent<CardProps> {
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
}
