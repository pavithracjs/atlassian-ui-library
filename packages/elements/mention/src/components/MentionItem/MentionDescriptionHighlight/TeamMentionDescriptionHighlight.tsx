import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Props } from './types';
import { TeamInformationStyle } from './styles';

function renderTeamInformation(memberCount?: number, includesYou?: boolean) {
  // todo - refactor with TeamOption ?
  // if Member count is missing, do not show the byline, regardless of the availability of includesYou
  if (memberCount === null || typeof memberCount === 'undefined') {
    return undefined;
  }
  return (
    <TeamInformationStyle>
      <FormattedMessage
        {...(memberCount > 50 ? messages.plus50Members : messages.memberCount)}
        values={{ count: memberCount, includes: includesYou }}
      />
    </TeamInformationStyle>
  );
}

export default class TeamMentionDescriptionHighlight extends React.PureComponent<
  Props,
  {}
> {
  render() {
    const { context } = this.props.mention;

    const includesYou = context && context.includesYou;
    const memberCount = context && context.memberCount;

    return renderTeamInformation(memberCount, includesYou);
  }
}

const messages = {
  memberCount: {
    id: 'fabric.elements.mentions.team.member.count',
    defaultMessage:
      '{count} {count, plural, one {member} other {members}}{includes, select, true {, including you} other {}}',
    description:
      'Number of members in the team and whether it includes the current user',
  },
  plus50Members: {
    id: 'fabric.elements.mentions.team.member.50plus',
    defaultMessage:
      '50+ members{includes, select, true {, including you} other {}}',
    description:
      'Number of members in a team exceeds 50 and whether it includes the current user',
  },
};
