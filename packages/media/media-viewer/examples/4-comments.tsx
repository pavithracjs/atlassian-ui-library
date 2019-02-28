import * as React from 'react';
import { ConversationContext } from '@atlaskit/media-core';
import RendererDemo from '../../../editor/renderer/examples/helper/RendererDemo';
import { MOCK_USERS } from '../../../editor/conversation/example-helpers/MockData';
import { MockProvider as ConversationResource } from '../../../editor/conversation/example-helpers/MockProvider';

export const conversationProvider = new ConversationResource({
  url: 'http://mockservice/',
  user: MOCK_USERS[3],
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
            id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
            type: 'file',
            collection: 'MediaServicesSample',
            width: 5845,
            height: 1243,
          },
        },
      ],
    },
  ],
};

export default function Example() {
  return (
    <ConversationContext.Provider value={conversationProvider}>
      <RendererDemo document={doc} withProviders={true} serializer="react" />
    </ConversationContext.Provider>
  );
}
