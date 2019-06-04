import * as React from 'react';
import {
  defineMessages,
  IntlProvider,
  injectIntl,
  InjectedIntlProps,
} from 'react-intl';

import * as untypedI18n from '../i18n';

export const messages = defineMessages({
  noAccessWarning: {
    id: 'fabric.mention.noAccess.warning',
    defaultMessage: "{name} won't be notified as they have no access",
    description:
      "Warning message to show that the mentioned user won't be notified",
  },
  noAccessLabel: {
    id: 'fabric.mention.noAccess.label',
    defaultMessage: 'No access',
    description: 'Label for no access icon',
  },
  defaultHeadline: {
    id: 'fabric.mention.error.defaultHeadline',
    defaultMessage: 'Something went wrong',
    description:
      'Error message shown when there is an error communicating with backend',
  },
  defaultAdvisedAction: {
    id: 'fabric.mention.error.defaultAction',
    defaultMessage: 'Try again in a few seconds',
    description: 'Default advised action when an error occurs',
  },
  loginAgain: {
    id: 'fabric.mention.error.loginAgain',
    defaultMessage: 'Try logging out then in again',
    description:
      'Login again message when there is an authentication error occurs',
  },
  differentText: {
    id: 'fabric.mention.error.differentText',
    defaultMessage: 'Try entering different text',
    description: 'Enter different text message when a forbidden error occurs',
  },
  memberCountWithoutYou: {
    id: 'fabric.elements.mentions.team.member.count',
    defaultMessage: '{0, plural, one {1 member} other {{0} members}}',
    description:
      'Byline to show the number of members in the team when the current user is not a member of the team',
  },
  memberCountWithYou: {
    id: 'fabric.elements.mentions.team.member.count.including.you',
    defaultMessage:
      '{0, plural, one { 1 member} other {{0} members}}, including you',
    description:
      'Byline to show the number of members in the team when the current user is also a member of the team',
  },
  plus50MembersWithoutYou: {
    id: 'fabric.elements.mentions.team.member.50plus',
    defaultMessage: '50+ members',
    description:
      'Byline to show the number of members in the team when the number exceeds 50',
  },
  plus50MembersWithYou: {
    id: 'fabric.elements.mentions.team.member.50plus.including.you',
    defaultMessage: '50+ members, including you',
    description:
      'Byline to show the number of members in the team when the number exceeds 50 and also includes the current user',
  },
});

const i18n: { [index: string]: Object | undefined } = untypedI18n;

const getCodesFromLocale = (locale: string) => {
  const [, language, country] = /([a-z]*)[_-]?([A-Z]*)/i.exec(locale || '');
  return [language.toLowerCase(), country.toUpperCase()];
};

interface ComponentProps {
  children: React.ReactElement<any>;
}

export const MentionIntlProvider = injectIntl<ComponentProps>(
  (props: ComponentProps & InjectedIntlProps) => {
    const { children, intl } = props;
    const [language] = getCodesFromLocale(intl.locale.toString());
    const messagesByLocale = i18n[language] || i18n.en;

    return (
      <IntlProvider messages={messagesByLocale} locale={language}>
        {children}
      </IntlProvider>
    );
  },
);
