import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { DescriptionBylineProps } from './types';
import { DescriptionBylineStyle } from './styles';
import { messages } from '../i18n';

export default class TeamMentionDescriptionByline extends React.PureComponent<
  DescriptionBylineProps,
  {}
> {
  renderTeamInformation(memberCount?: number, includesYou?: boolean) {
    // if Member count is missing, do not show the byline, regardless of the availability of includesYou
    if (typeof memberCount !== 'number') {
      return null;
    }

    return (
      <DescriptionBylineStyle>
        <FormattedMessage
          {...(memberCount > 50
            ? messages.plus50Members
            : messages.memberCount)}
          values={{ count: memberCount, includes: includesYou }}
        />
      </DescriptionBylineStyle>
    );
  }

  render() {
    const { context } = this.props.mention;

    const includesYou = context && context.includesYou;
    const memberCount = context && context.memberCount;

    return this.renderTeamInformation(memberCount, includesYou);
  }
}
