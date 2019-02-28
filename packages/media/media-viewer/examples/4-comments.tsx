import * as React from 'react';
import {
  ConversationContext,
  conversationProvider,
} from '@atlaskit/media-core';
import RendererDemo from '../../../editor/renderer/examples/helper/RendererDemo';

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
