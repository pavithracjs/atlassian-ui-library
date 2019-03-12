import * as React from 'react';
import { DescriptionHighlightProps } from './types';
import { renderHighlight } from '../MentionItem/MentionHighlightHelpers';
import { NicknameStyle } from './styles';

export default class UserMentionDescriptionHighlight extends React.PureComponent<
  DescriptionHighlightProps,
  {}
> {
  render() {
    const { highlight, nickname } = this.props.mention;
    const nicknameHighlights = highlight && highlight.nickname;

    return renderHighlight(NicknameStyle, nickname, nicknameHighlights, '@');
  }
}
