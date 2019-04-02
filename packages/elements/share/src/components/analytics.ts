import { AnalyticsEventPayload } from '@atlaskit/analytics-next-types';
import { isEmail, isTeam, isUser, OptionData } from '@atlaskit/user-picker';
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

export const buttonClicked = () =>
  createEvent('ui', 'clicked', 'button', 'share');

export const cancelShare = (start: number) =>
  createEvent('ui', 'pressed', 'keyboardShortcut', 'cancelShare', {
    source: 'shareModal',
    duration: duration(start),
  });

export const copyShareLink = (
  start: number,
  shareOrigin?: OriginTracing | null,
) =>
  createEvent('ui', 'clicked', 'button', 'copyShareLink', {
    source: 'shareModal',
    duration: duration(start),
    ...handleShareOrigin(shareOrigin),
  });

export const screenEvent = () => createScreenEvent('shareModal');

export const submitShare = (
  start: number,
  data: DialogContentState,
  shareOrigin?: OriginTracing | null,
  config?: ConfigResponse,
) => {
  const users = extractIdsByType(data, isUser);
  const teams = extractIdsByType(data, isTeam);
  const emails = extractIdsByType(data, isEmail);
  return createEvent('ui', 'clicked', 'button', 'submitShare', {
    ...handleShareOrigin(shareOrigin),
    duration: duration(start),
    emailCount: emails.length,
    teamCount: teams.length,
    userCount: users.length,
    users,
    teams,
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
