import * as React from 'react';
import { UserType } from '../../../types';
import { Props } from './types';
import UserMentionDescriptionHighlight from './UserMentionDescriptionHighlight';
import TeamMentionDescriptionHighlight from './TeamMentionDescriptionHighlight';

export default class MentionDescriptionHighlight extends React.PureComponent<
  Props,
  {}
> {
  render() {
    const { userType } = this.props.mention;

    let isTeamType: boolean;
    // todo - replace with a switch?
    if (userType) {
      isTeamType = userType === UserType[UserType.TEAM];
    } else {
      isTeamType = false;
    }

    if (isTeamType) {
      return <TeamMentionDescriptionHighlight mention={this.props.mention} />;
    } else {
      return <UserMentionDescriptionHighlight mention={this.props.mention} />;
    }
  }
}
