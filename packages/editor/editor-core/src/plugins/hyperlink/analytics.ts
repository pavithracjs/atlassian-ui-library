import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
  AnalyticsEventPayload,
  InputMethodInsertLink,
} from '../analytics';

export function getLinkCreationAnalyticsEvent(
  inputMethod: InputMethodInsertLink,
  url: string,
): AnalyticsEventPayload {
  // Remove protocol, if it exists
  const withoutProtocol = url.toLowerCase().replace(/^(.*):\/\//, '');

  // Remove port, fragment, path, query string
  const linkDomain = withoutProtocol.replace(/[:\/?#](.*)$/, '');

  return {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.LINK,
    attributes: { inputMethod },
    eventType: EVENT_TYPE.TRACK,
    nonPrivacySafeAttributes: { linkDomain },
  };
}
