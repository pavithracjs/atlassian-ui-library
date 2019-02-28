import * as React from 'react';
import { ConversationContext } from '@atlaskit/media-core';
import { genericFileId, imageFileId } from '@atlaskit/media-test-helpers';
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

export default function Example() {
  return (
    <ConversationContext.Provider value={conversationProvider}>
      <RendererDemo document={doc} withProviders={true} serializer="react" />
    </ConversationContext.Provider>
  );
}
