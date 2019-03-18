import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DescriptionHighlightProps } from './types';
import { DescriptionHighlightStyle } from './styles';

export default class TeamMentionDescriptionHighlight extends React.PureComponent<
  DescriptionHighlightProps,
  {}
> {
  renderTeamInformation(memberCount?: number, includesYou?: boolean) {
    // TEAMS-333 This same logic is implemented in User Picker as well. https://product-fabric.atlassian.net/browse/TEAMS-333
    // will extract this to a common place

    // if Member count is missing, do not show the byline, regardless of the availability of includesYou
    if (typeof memberCount !== 'number') {
      return null;
    }

    return (
      <DescriptionHighlightStyle>
        <FormattedMessage
          {...(memberCount > 50
            ? messages.plus50Members
            : messages.memberCount)}
          values={{ count: memberCount, includes: includesYou }}
        />
      </DescriptionHighlightStyle>
    );
  }

  render() {
    const { context } = this.props.mention;

    const includesYou = context && context.includesYou;
    const memberCount = context && context.memberCount;

    return this.renderTeamInformation(memberCount, includesYou);
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
