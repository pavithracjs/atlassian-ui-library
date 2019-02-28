import { createContext } from 'react';
// import {ConversationResource} from '@atlaskit/conversation';
import { ConversationResource } from '../../../editor/conversation';
export const ConversationContext = createContext<ConversationResource>(
  {} as any,
);
