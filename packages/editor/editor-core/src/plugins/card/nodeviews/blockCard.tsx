import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { Card as SmartCard } from '@atlaskit/smart-card';
import * as PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import { SmartCardProps, Card } from './genericCard';
import UnsupportedBlockNode from '../../unsupported-content/nodeviews/unsupported-block';
import { SelectionBasedNodeView } from '../../../nodeviews/ReactNodeView';

export interface Props {
  children?: React.ReactNode;
  node: PMNode;
  getPos?: () => number;
  view: EditorView;
  selected?: boolean;
}
export class BlockCardComponent extends React.PureComponent<SmartCardProps> {
  onClick = () => {};

  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  render() {
    const { node, selected, cardContext } = this.props;
    const { url, data } = node.attrs;

    // render an empty span afterwards to get around Webkit bug
    // that puts caret in next editable text element
    const cardInner = (
      <>
        <SmartCard
          url={url}
          data={data}
          appearance="block"
          isSelected={selected}
          onClick={this.onClick}
        />
        <span contentEditable={true} />
      </>
    );

    return (
      <div>
        {cardContext ? (
          <cardContext.Provider value={cardContext.value}>
            {cardInner}
          </cardContext.Provider>
        ) : (
          cardInner
        )}
      </div>
    );
  }
}

const WrappedBlockCard = Card(BlockCardComponent, UnsupportedBlockNode);

export class BlockCard extends SelectionBasedNodeView {
  render() {
    return (
      <WrappedBlockCard
        node={this.node}
        selected={this.insideSelection()}
        view={this.view}
      />
    );
  }
}
