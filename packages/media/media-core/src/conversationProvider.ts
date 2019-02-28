import { createContext } from 'react';
import { ConversationResource } from '@atlaskit/conversation';
export const ConversationContext = createContext<ConversationResource>(
  {} as any,
);
