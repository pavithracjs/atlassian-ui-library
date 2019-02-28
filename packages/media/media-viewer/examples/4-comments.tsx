import * as React from 'react';
import { ConversationContext } from '@atlaskit/media-core';
import { genericFileId, imageFileId } from '@atlaskit/media-test-helpers';
import RendererDemo from '../../../editor/renderer/examples/helper/RendererDemo';
import { MOCK_USERS } from '../../../editor/conversation/example-helpers/MockData';
import { ConversationResource } from '@atlaskit/conversation';
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
            id: genericFileId.id,
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

// const mediaObjectId = 'ari:cloud:platform::media/demo';
// const localId = 'mock-media-comments-1-local'

// conversationProvider.create(localId, doc, {}, genericFileId.id);
// conversationProvider.create(localId, doc, {}, imageFileId.id);

// export default () => <div/>

export default function Example() {
  return (
    <ConversationContext.Provider value={conversationProvider}>
      <RendererDemo document={doc} withProviders={true} serializer="react" />
    </ConversationContext.Provider>
  );
}
