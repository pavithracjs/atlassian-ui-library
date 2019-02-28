import { createContext } from 'react';
import { MOCK_USERS } from '../../../editor/conversation/example-helpers/MockData';
import { MockProvider as ConversationResource } from '../../../editor/conversation/example-helpers/MockProvider';

export const conversationProvider = new ConversationResource({
  url: 'http://mockservice/',
  user: MOCK_USERS[3],
});

export const ConversationContext = createContext(conversationProvider);
