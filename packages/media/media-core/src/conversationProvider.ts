import { createContext } from 'react';
import {
  ConversationInterface,
  ConversationResource,
} from '@atlaskit/conversation';
export const ConversationResourceContext = createContext<ConversationResource>(
  {} as any,
);

export interface PageConversations {
  conversations: ConversationInterface[];
  objectId?: string;
}

export const ConversationsContext = createContext<PageConversations>({
  conversations: [],
});

export const createMediaObjectId = (id: string) =>
  `ari:cloud:media::file/${id}`;
