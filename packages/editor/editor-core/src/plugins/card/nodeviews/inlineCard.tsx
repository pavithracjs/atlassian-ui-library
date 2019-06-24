import * as React from 'react';
import { EventHandler, MouseEvent, KeyboardEvent } from 'react';
import * as PropTypes from 'prop-types';
import { Card } from '@atlaskit/smart-card';
import { findOverflowScrollParent } from '@atlaskit/editor-common';

import { ZeroWidthSpace } from '../../../utils';
import { SmartCardProps } from './genericCard';

export class InlineCard extends React.PureComponent<SmartCardProps> {
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
          <Card
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
