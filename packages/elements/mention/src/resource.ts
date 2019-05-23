import MentionResource, {
  AbstractMentionResource,
  HydratingMentionProvider,
  MentionContextIdentifier,
  MentionProvider,
  MentionStats,
  MentionResourceConfig,
  isHydratingMentionProvider,
} from './api/MentionResource';
import PresenceResource, {
  PresenceProvider,
  AbstractPresenceResource,
} from './api/PresenceResource';
import {
  MentionNameClient,
  MentionNameResult,
  MentionNameDetails,
} from './api/MentionNameClient';
import { MentionNameResolver } from './api/MentionNameResolver';
import { MentionDescription, MentionsResult, isSpecialMention } from './types';
import { ELEMENTS_CHANNEL } from './_constants';
import ContextMentionResource from './api/ContextMentionResource';

export {
  // Classes
  ContextMentionResource,
  MentionResource,
  MentionNameResolver,
  PresenceResource,
  AbstractMentionResource,
  AbstractPresenceResource,
  // Interfaces
  HydratingMentionProvider,
  MentionProvider,
  PresenceProvider,
  MentionDescription,
  MentionsResult,
  MentionNameClient,
  // types
  MentionContextIdentifier,
  MentionStats,
  MentionResourceConfig,
  MentionNameResult,
  MentionNameDetails,
  // Functions
  isSpecialMention,
  isHydratingMentionProvider,
  // Constants
  ELEMENTS_CHANNEL,
};
