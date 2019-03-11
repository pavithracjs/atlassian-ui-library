import { SyntheticEvent } from 'react';

export interface HighlightDetail {
  start: number;
  end: number;
}

export interface Highlight {
  name: HighlightDetail[];
  mentionName: HighlightDetail[];
  nickname: HighlightDetail[];
}

export interface Presence {
  time?: string;
  status?: string;
}

export interface MentionDescription {
  id: string;
  avatarUrl?: string;
  name?: string;
  mentionName?: string;
  nickname?: string;
  highlight?: Highlight;
  lozenge?: string;
  presence?: Presence;
  accessLevel?: string;
  inContext?: boolean;
  userType?: string;
  // Team mention can use context to store members data
  context?: MentionDescContext;
}

export interface MentionDescContext {
  members: TeamMember[];
}

export interface MentionsResult {
  mentions: MentionDescription[];
  query: string;
}

/* Team types  */
enum TeamState {
  ACTIVE = 'ACTIVE',
  DISBANDED = 'DISBANDED',
}
enum TeamMembershipSetting {
  OPEN = 'OPEN',
}
enum TeamDiscoverable {
  DISCOVERABLE = 'DISCOVERABLE',
}
enum TeamRestriction {
  ORG_MEMBERS = 'ORG_MEMBERS',
  NO_RESTRICTION = 'NO_RESTRICTION',
}

export interface TeamMember {
  id: string;
  name: string;
}

// data is returned from team search service
export interface Team {
  id: string;
  largeHeaderImageUrl: string;
  smallHeaderImageUrl: string;
  largeAvatarImageUrl: string;
  smallAvatarImageUrl: string;
  description: string;
  displayName: string;
  state: TeamState;
  membershipSettings?: TeamMembershipSetting;
  discoverable: TeamDiscoverable;
  organizationId: string;
  restriction?: TeamRestriction;
  members: TeamMember[];
}

export type MentionEventHandler = (
  mentionId: string,
  text: string,
  event?: SyntheticEvent<HTMLSpanElement>,
) => void;

export interface OnMentionEvent {
  (mention: MentionDescription, event?: SyntheticEvent<any>): void;
}

export enum MentionType {
  SELF,
  RESTRICTED,
  DEFAULT,
}

export enum UserAccessLevel {
  NONE,
  SITE,
  APPLICATION,
  CONTAINER,
}

export enum UserType {
  DEFAULT,
  SPECIAL,
  APP,
  TEAM,
  SYSTEM,
}

export function isRestricted(accessLevel?: string): boolean {
  return (
    !!accessLevel && accessLevel !== UserAccessLevel[UserAccessLevel.CONTAINER]
  );
}

export function isSpecialMention(mention: MentionDescription): boolean {
  return !!mention.userType && mention.userType === UserType[UserType.SPECIAL];
}

export function isAppMention(mention: MentionDescription) {
  return mention.userType && mention.userType === UserType[UserType.APP];
}

export function isTeamMention(mention: MentionDescription) {
  return mention.userType && mention.userType === UserType[UserType.TEAM];
}

export function isSpecialMentionText(mentionText: string) {
  return mentionText && (mentionText === '@all' || mentionText === '@here');
}
