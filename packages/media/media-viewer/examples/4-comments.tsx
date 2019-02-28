import * as React from 'react';
import {
  ConversationResourceContext,
  ConversationsContext,
  PageConversations,
} from '@atlaskit/media-core';
import { imageFileId, gifFileId } from '@atlaskit/media-test-helpers';
import RendererDemo from '../../../editor/renderer/examples/helper/RendererDemo';
import { MOCK_USERS } from '../../../editor/conversation/example-helpers/MockData';
import {
  ConversationInterface,
  ConversationResource,
} from '@atlaskit/conversation';
import { ConversationAuth } from '../../../editor/conversation/src/api/ConversationResource';

const conversationAuthProvider = () => {
  const url =
    'https://api-private.stg.atlassian.com/media-playground/api/token/user/convo';
  let auth: Promise<ConversationAuth> | undefined;

  return async () => {
    if (auth) {
      return auth;
    }

    auth = new Promise<ConversationAuth>(async resolve => {
      const newAuth = await (await fetch(url, {
        credentials: 'include',
      })).json();

      resolve(newAuth);
    });

    return auth;
  };
};

export const conversationProvider = new ConversationResource({
  url: 'https://pf-conversation-service.us-west-2.staging.atl-paas.net',
  user: MOCK_USERS[3],
  authProvider: conversationAuthProvider(),
});

const doc = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'full-width',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: gifFileId.id,
            type: 'file',
            collection: 'MediaServicesSample',
            width: 250,
            height: 30,
          },
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'full-width',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: imageFileId.id,
            type: 'file',
            collection: 'MediaServicesSample',
            width: 100,
            height: 10,
          },
        },
      ],
    },
  ],
};

interface State {
  conversations: ConversationInterface[];
}

const PAGE_OBJECT_ID = 'ari:cloud:platform::conversation/media-viewer-demo';

export default class Example extends React.Component<{}, State> {
  state: State = {
    conversations: [],
  };

  async componentWillMount() {
    const conversations = await conversationProvider.getConversations(
      PAGE_OBJECT_ID,
    );
    this.setState({ conversations });
  }

  render() {
    const { conversations } = this.state;
    // TODO usubscribe on unmount
    const usubscribe = conversationProvider.store.subscribe(() => {
      const state = conversationProvider.store.getState();
      if (state) {
        console.log('subscribe callback');
        this.setState({ conversations: state.conversations });
      }
    });

    const pageConversations: PageConversations = {
      conversations,
      objectId: PAGE_OBJECT_ID,
    };
    return (
      <ConversationResourceContext.Provider value={conversationProvider}>
        <ConversationsContext.Provider value={pageConversations}>
          <RendererDemo
            document={doc}
            withProviders={true}
            serializer="react"
          />
        </ConversationsContext.Provider>
      </ConversationResourceContext.Provider>
    );
  }
}
