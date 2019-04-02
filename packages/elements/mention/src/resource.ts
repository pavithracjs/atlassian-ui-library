import MentionResource, {
  AbstractMentionResource,
  MentionContextIdentifier,
  MentionProvider,
  MentionStats,
  MentionResourceConfig,
} from './api/MentionResource';
import PresenceResource, {
  PresenceProvider,
  AbstractPresenceResource,
} from './api/PresenceResource';
import { MentionDescription, MentionsResult, isSpecialMention } from './types';
import { ELEMENTS_CHANNEL } from './_constants';
import ContextMentionResource from './api/ContextMentionResource';

export {
  // Classes
  ContextMentionResource,
  MentionResource,
  PresenceResource,
  AbstractMentionResource,
  AbstractPresenceResource,
  // Interfaces
  MentionProvider,
  PresenceProvider,
  MentionDescription,
  MentionsResult,
  // types
  MentionContextIdentifier,
  MentionStats,
  MentionResourceConfig,
  // Functions
  isSpecialMention,
  // Constants
  ELEMENTS_CHANNEL,
};
