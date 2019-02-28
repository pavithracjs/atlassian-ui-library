import * as React from 'react';
import { ConversationContext, FileIdentifier } from '@atlaskit/media-core';
import Conversation from '@atlaskit/conversation';
// import ConversationResource from '../../../../editor/conversation/src/api/ConversationResource';
// import Conversation from '../../../../editor/conversation/src/containers/Conversation';

interface Props {
  identifier: FileIdentifier;
}

interface State {
  objectId?: string;
}

export class CommentsSection extends React.Component<Props, State> {
  state: State = {};

  async componentWillMount() {
    const id = await this.props.identifier.id;
    this.setState({ objectId: id });
  }

  render() {
    const { objectId } = this.state;
    return (
      <div style={{ width: 400 }}>
        <ConversationContext.Consumer>
          {conversationResource =>
            objectId ? (
              <Conversation
                provider={conversationResource}
                objectId={objectId}
              />
            ) : (
              'LOADING'
            )
          }
        </ConversationContext.Consumer>
      </div>
    );
  }
}
