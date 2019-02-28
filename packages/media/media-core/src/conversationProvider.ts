import { createContext } from 'react';
import { ConversationResource } from '@atlaskit/conversation';
export const ConversationContext = createContext<ConversationResource>(
  {} as any,
);

export const createMediaObjectId = (id: string) =>
  `ari:cloud:media::file/${id}`;
