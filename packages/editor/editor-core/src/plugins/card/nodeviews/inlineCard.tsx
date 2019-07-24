import * as React from 'react';
import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import * as PropTypes from 'prop-types';
import { Card as SmartCard } from '@atlaskit/smart-card';
import { findOverflowScrollParent } from '@atlaskit/editor-common';

import { ZeroWidthSpace } from '../../../utils';
import { SmartCardProps, Card } from './genericCard';
import UnsupportedInlineNode from '../../unsupported-content/nodeviews/unsupported-inline';
import { SelectionBasedNodeView } from '../../../nodeviews/ReactNodeView';

export class InlineCardComponent extends React.PureComponent<SmartCardProps> {
  private scrollContainer?: HTMLElement;
  private onClick: EventHandler<MouseEvent | KeyboardEvent> = () => {};

  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  componentWillMount() {
    const { view } = this.props;
    const scrollContainer = findOverflowScrollParent(view.dom as HTMLElement);
    this.scrollContainer = scrollContainer || undefined;
  }

  render() {
    const { node, selected, cardContext } = this.props;
    const { url, data } = node.attrs;

    const card = (
      <span>
        <span>{ZeroWidthSpace}</span>
        <span className="card">
          <SmartCard
            url={url}
            data={data}
            appearance="inline"
            isSelected={selected}
            onClick={this.onClick}
            container={this.scrollContainer}
          />
        </span>
      </span>
    );

    return cardContext ? (
      <cardContext.Provider value={cardContext.value}>
        {card}
      </cardContext.Provider>
    ) : (
      card
    );
  }
}

const WrappedInlineCard = Card(InlineCardComponent, UnsupportedInlineNode);

export class InlineCard extends SelectionBasedNodeView {
  render() {
    return (
      <WrappedInlineCard
        node={this.node}
        selected={this.insideSelection()}
        view={this.view}
      />
    );
  }
}
