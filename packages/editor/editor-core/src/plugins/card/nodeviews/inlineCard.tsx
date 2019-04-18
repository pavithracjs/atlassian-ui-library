import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Node as PMNode } from 'prosemirror-model';
import { Card } from '@atlaskit/smart-card';

import { EditorView } from 'prosemirror-view';
import wrapComponentWithClickArea from '../../../nodeviews/legacy-nodeview-factory/ui/wrapper-click-area';
import { stateKey as ReactNodeViewState } from '../../../plugins/base/pm-plugins/react-nodeview';

export interface Props {
  children?: React.ReactNode;
  node: PMNode;
  getPos: () => number;
  view: EditorView;
  selected?: boolean;
}

class InlineCardNode extends React.PureComponent<Props, {}> {
  onClick = () => {};

  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  render() {
    const { node, selected } = this.props;
    const { url, data } = node.attrs;

    const cardContext = this.context.contextAdapter
      ? this.context.contextAdapter.card
      : undefined;

    // add an extra span at the start so the cursor doesn't appear next to the text inside the Card
    const card = (
      <span>
        <span />
        <Card
          url={url}
          data={data}
          appearance="inline"
          isSelected={selected}
          onClick={this.onClick}
        />
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

const ClickableInlineCard = wrapComponentWithClickArea(InlineCardNode, true);

export default class WrappedInline extends React.PureComponent<Props, {}> {
  render() {
    return (
      <ClickableInlineCard
        {...this.props}
        pluginState={ReactNodeViewState.getState(this.props.view.state)}
      />
    );
  }
}
