import * as React from 'react';
import { ConversationContext, FileIdentifier } from '@atlaskit/media-core';
import { Conversation } from '@atlaskit/conversation';
import { AtlaskitThemeProvider } from '@atlaskit/theme';
import { CommentsSectionWrapper } from './styled';

interface Props {
  identifier: FileIdentifier;
}

interface State {
  conversationId?: string;
}

export class CommentsSection extends React.Component<Props, State> {
  state: State = {};

  async componentWillMount() {
    const conversationId = await this.props.identifier.id;
    this.setState({ conversationId });
  }

  render() {
    const { conversationId } = this.state;
    return (
      <CommentsSectionWrapper>
        <ConversationContext.Consumer>
          {conversationResource =>
            conversationId ? (
              <Conversation
                id={conversationId}
                objectId="ari:cloud:platform::conversation/demo"
                provider={conversationResource}
              />
            ) : (
              'LOADING'
            )
          }
        </ConversationContext.Consumer>
      </CommentsSectionWrapper>
    );
  }
}
