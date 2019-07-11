import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  unknownUserError: {
    id: 'fabric.mention.unknow.user.error',
    defaultMessage: 'Unknown user {userId}',
    description: 'Mention user name could not be found or look up failed',
  },
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
      '{0, plural, one {1 member} other {{0} members}}, including you',
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
  spotlightTitle: {
    id: 'fabric.elements.mentions.team.spotlight.title',
    defaultMessage: 'You can now mention teams!',
    description:
      'Title of the spotlight shown in the mention tpyeahead. This is related to team mentions',
  },
  spotlightCloseButtonToolTip: {
    id: 'fabric.elements.mentions.team.spotlight.close.button.tooltip',
    defaultMessage: 'Dismiss',
    description:
      'Closes the spotlight component when this button is clicked. This text for the tooltip of that button',
  },
});
