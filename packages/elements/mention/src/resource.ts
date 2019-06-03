import MentionResource, {
  AbstractMentionResource,
  ResolvingMentionProvider,
  MentionContextIdentifier,
  MentionProvider,
  MentionStats,
  MentionResourceConfig,
  isResolvingMentionProvider,
} from './api/MentionResource';
import PresenceResource, {
  PresenceProvider,
  AbstractPresenceResource,
} from './api/PresenceResource';
import {
  DefaultMentionNameResolver,
  MentionNameResolver,
} from './api/MentionNameResolver';
import {
  MentionNameClient,
  MentionNameResult,
  MentionNameDetails,
} from './api/MentionNameClient';
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
  DefaultMentionNameResolver,
  // Interfaces
  ResolvingMentionProvider,
  MentionProvider,
  PresenceProvider,
  MentionDescription,
  MentionsResult,
  MentionNameClient,
  MentionNameResolver,
  // types
  MentionContextIdentifier,
  MentionStats,
  MentionResourceConfig,
  MentionNameResult,
  MentionNameDetails,
  // Functions
  isSpecialMention,
  isResolvingMentionProvider,
  // Constants
  ELEMENTS_CHANNEL,
};
