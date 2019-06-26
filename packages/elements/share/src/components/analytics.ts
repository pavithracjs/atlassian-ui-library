import { AnalyticsEventPayload } from '@atlaskit/analytics-next';
import {
  isEmail,
  isTeam,
  isUser,
  OptionData,
  Team,
} from '@atlaskit/user-picker';
import {
  ConfigResponse,
  DialogContentState,
  OriginTracing,
} from '../types/index.js';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

const buildAttributes = (attributes = {}) => ({
  packageName,
  packageVersion,
  ...attributes,
});

const createEvent = (
  eventType: 'ui' | 'operational',
  action: string,
  actionSubject: string,
  actionSubjectId: string,
  attributes = {},
): AnalyticsEventPayload => ({
  eventType,
  action,
  actionSubject,
  actionSubjectId,
  attributes: buildAttributes(attributes),
});

const createScreenEvent = (
  name: string,
  attributes = {},
): AnalyticsEventPayload => ({
  eventType: 'screen',
  name,
  attributes: buildAttributes(attributes),
});

// = share dialog invoked. Not to be confused with "share submitted"
export const shareTriggerButtonClicked = () =>
  createEvent('ui', 'clicked', 'button', 'share');

export const cancelShare = (start: number) =>
  createEvent('ui', 'pressed', 'keyboardShortcut', 'cancelShare', {
    source: 'shareModal',
    duration: duration(start),
  });

export const copyLinkButtonClicked = (
  start: number,
  shareOrigin?: OriginTracing | null,
) =>
  createEvent('ui', 'clicked', 'button', 'copyShareLink', {
    source: 'shareModal',
    duration: duration(start),
    ...handleShareOrigin(shareOrigin),
  });

export const screenEvent = () => createScreenEvent('shareModal');

export const formShareSubmitted = (
  start: number,
  data: DialogContentState,
  shareContentType?: string,
  shareOrigin?: OriginTracing | null,
  config?: ConfigResponse,
) => {
  const users = extractIdsByType(data, isUser);
  const teams = extractIdsByType(data, isTeam);
  const teamUserCounts = extractMemberCountsFromTeams(data, isTeam);
  const emails = extractIdsByType(data, isEmail);
  return createEvent('ui', 'clicked', 'button', 'submitShare', {
    ...handleShareOrigin(shareOrigin),
    contentType: shareContentType,
    duration: duration(start),
    emailCount: emails.length,
    teamCount: teams.length,
    userCount: users.length,
    users,
    teams,
    teamUserCounts,
    messageLength:
      config &&
      config.allowComment &&
      data.comment &&
      data.comment.format === 'plain_text'
        ? data.comment.value.length
        : 0,
    isMessageEnabled: config ? config.allowComment : false,
  });
};

const duration = (start: number) => Date.now() - start;

const handleShareOrigin = (shareOrigin?: OriginTracing | null) =>
  shareOrigin
    ? shareOrigin.toAnalyticsAttributes({ hasGeneratedId: true })
    : {};

const extractIdsByType = <T extends OptionData>(
  data: DialogContentState,
  checker: (option: OptionData) => option is T,
): string[] => data.users.filter(checker).map(option => option.id);

const extractMemberCountsFromTeams = (
  data: DialogContentState,
  checker: (option: OptionData) => option is Team,
): number[] =>
  // teams with zero memberships cannot exist in share, so we use that
  // as the default value for undefined team member counts
  data.users.filter(checker).map(option => option.memberCount || 0);
