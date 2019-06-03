import MentionResource, {
  AbstractMentionResource,
  MentionContextIdentifier,
  MentionProvider,
  ResolvingMentionProvider,
  MentionStats,
  MentionResourceConfig,
  isResolvingMentionProvider,
} from './api/MentionResource';
import TeamMentionResource from './api/TeamMentionResource';
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
import MentionItem from './components/MentionItem';
import MentionList from './components/MentionList';
import ResourcedMentionList from './components/ResourcedMentionList';
import { MentionPickerWithAnalytics as MentionPicker } from './components/MentionPicker';
import Mention from './components/Mention';
import ResourcedMention from './components/Mention/ResourcedMention';
import {
  MentionDescription,
  MentionsResult,
  isSpecialMention,
  TeamMember,
} from './types';
import { ELEMENTS_CHANNEL } from './_constants';
import ContextMentionResource from './api/ContextMentionResource';

export {
  // Classes
  ContextMentionResource,
  MentionResource,
  TeamMentionResource,
  PresenceResource,
  DefaultMentionNameResolver,
  AbstractMentionResource,
  AbstractPresenceResource,
  // Interfaces
  ResolvingMentionProvider,
  MentionProvider,
  PresenceProvider,
  MentionDescription,
  MentionsResult,
  MentionNameResolver,
  MentionNameClient,
  MentionNameResult,
  MentionNameDetails,
  // types
  MentionContextIdentifier,
  MentionStats,
  TeamMember,
  MentionResourceConfig,
  // Components
  MentionItem,
  MentionList,
  ResourcedMentionList,
  MentionPicker,
  Mention,
  ResourcedMention,
  // Functions
  isSpecialMention,
  isResolvingMentionProvider,
  // Constants
  ELEMENTS_CHANNEL,
};

export default MentionPicker;
