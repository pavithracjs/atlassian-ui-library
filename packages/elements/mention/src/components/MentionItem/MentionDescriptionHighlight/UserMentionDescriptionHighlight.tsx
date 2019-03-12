import * as React from 'react';
import { Props } from './types';
import { renderHighlight } from '../MentionHighlightHelpers';
import { NicknameStyle } from './styles';

export default class UserMentionDescriptionHighlight extends React.PureComponent<
  Props,
  {}
> {
  render() {
    const { highlight, nickname } = this.props.mention;

    const nicknameHighlights = highlight && highlight.nickname;

    return renderHighlight(NicknameStyle, nickname, nicknameHighlights, '@');
  }
}
