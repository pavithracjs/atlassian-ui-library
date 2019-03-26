import * as React from 'react';
import { UserType } from '../../types';
import { DescriptionHighlightProps } from './types';
import UserMentionDescriptionHighlight from './UserMentionDescriptionHighlight';
import TeamMentionDescriptionHighlight from './TeamMentionDescriptionHighlight';

export default class MentionDescriptionHighlight extends React.PureComponent<
  DescriptionHighlightProps,
  {}
> {
  render() {
    const { userType } = this.props.mention;

    switch (userType) {
      case UserType[UserType.TEAM]: {
        return <TeamMentionDescriptionHighlight mention={this.props.mention} />;
      }
      default: {
        return <UserMentionDescriptionHighlight mention={this.props.mention} />;
      }
    }
  }
}
