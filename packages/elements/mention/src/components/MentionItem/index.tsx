import Avatar from '@atlaskit/avatar';
import LockCircleIcon from '@atlaskit/icon/glyph/lock-circle';
import Lozenge from '@atlaskit/lozenge';
import { colors } from '@atlaskit/theme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  HighlightDetail,
  isRestricted,
  MentionDescription,
  OnMentionEvent,
  Presence,
  UserType,
} from '../../types';
import { NoAccessLabel } from '../../util/i18n';
import { leftClick } from '../../util/mouse';
import { NoAccessTooltip } from '../NoAccessTooltip';
import {
  AccessSectionStyle,
  AvatarStyle,
  FullNameStyle,
  InfoSectionStyle,
  MentionItemStyle,
  NameSectionStyle,
  NicknameStyle,
  RowStyle,
  TimeStyle,
  TeamInformationStyle,
} from './styles';

type ReactComponentConstructor = new (props: any) => React.Component<any, any>;

interface Part {
  value: string;
  matches: boolean;
}

function renderHighlight(
  ReactComponent: ReactComponentConstructor,
  value?: string,
  highlights?: HighlightDetail[],
  prefix?: string,
) {
  if (!value) {
    return null;
  }

  const parts: Part[] = [];
  const prefixText = prefix || '';
  let lastIndex = 0;

  if (highlights) {
    for (let i = 0; i < highlights.length; i++) {
      const h = highlights[i];
      const start = h.start;
      const end = h.end;
      if (start > lastIndex) {
        parts.push({
          value: value.substring(lastIndex, start),
          matches: false,
        });
      }
      parts.push({
        value: value.substring(start, end + 1),
        matches: true,
      });
      lastIndex = end + 1;
    }
    if (lastIndex < value.length) {
      parts.push({
        value: value.substring(lastIndex, value.length),
        matches: false,
      });
    }
  } else {
    parts.push({
      value,
      matches: false,
    });
  }

  return (
    <ReactComponent>
      {prefixText}
      {parts.map((part, index) => {
        if (part.matches) {
          return <b key={index}>{part.value}</b>;
        }
        return part.value;
      })}
    </ReactComponent>
  );
}

function renderTeamInformation(
  ReactComponent: ReactComponentConstructor,
  memberCount?: number,
  includesYou?: boolean,
) {
  // todo - refactor with TeamOption ?
  // if Member count is missing, do not show the byline, regardless of the availability of includesYou
  if (memberCount === null || typeof memberCount === 'undefined') {
    return undefined;
  }
  return (
    <ReactComponent>
      <FormattedMessage
        {...(memberCount > 50 ? messages.plus50Members : messages.memberCount)}
        values={{ count: memberCount, includes: includesYou }}
      />
    </ReactComponent>
  );
}

function renderLozenge(lozenge?: string) {
  if (lozenge) {
    return <Lozenge>{lozenge}</Lozenge>;
  }
  return null;
}

function renderTime(time?: string) {
  if (time) {
    return <TimeStyle>{time}</TimeStyle>;
  }
  return null;
}

export interface Props {
  mention: MentionDescription;
  selected?: boolean;
  onMouseMove?: OnMentionEvent;
  onSelection?: OnMentionEvent;
}

export default class MentionItem extends React.PureComponent<Props, {}> {
  // internal, used for callbacks
  private onMentionSelected = (event: React.MouseEvent<any>) => {
    if (leftClick(event) && this.props.onSelection) {
      event.preventDefault();
      this.props.onSelection(this.props.mention, event);
    }
  };

  private onMentionMenuItemMouseMove = (event: React.MouseEvent<any>) => {
    if (this.props.onMouseMove) {
      this.props.onMouseMove(this.props.mention, event);
    }
  };

  render() {
    const { mention, selected } = this.props;
    const {
      id,
      highlight,
      avatarUrl,
      presence,
      name,
      mentionName,
      nickname,
      lozenge,
      accessLevel,
      context,
      userType,
    } = mention;
    const { status, time } = presence || ({} as Presence);
    const restricted = isRestricted(accessLevel);

    const nameHighlights = highlight && highlight.name;
    const nicknameHighlights = highlight && highlight.nickname;
    const borderColor = selected ? colors.N30 : undefined;

    let isTeamType: boolean;

    if (userType) {
      isTeamType = userType === UserType[UserType.TEAM];
    } else {
      isTeamType = false;
    }

    let bottomHighlight;
    if (isTeamType) {
      const includesYou = context && context.includesYou;
      const memberCount = context && context.memberCount;
      bottomHighlight = renderTeamInformation(
        TeamInformationStyle,
        memberCount,
        includesYou,
      );
    } else {
      bottomHighlight = renderHighlight(
        NicknameStyle,
        nickname,
        nicknameHighlights,
        '@',
      );
    }

    return (
      <MentionItemStyle
        selected={selected}
        onMouseDown={this.onMentionSelected}
        onMouseMove={this.onMentionMenuItemMouseMove}
        data-mention-id={id}
        data-mention-name={mentionName}
      >
        <RowStyle>
          <AvatarStyle restricted={restricted}>
            <Avatar
              src={avatarUrl}
              size="medium"
              presence={status}
              borderColor={borderColor}
            />
          </AvatarStyle>
          <NameSectionStyle restricted={restricted}>
            {renderHighlight(FullNameStyle, name, nameHighlights)}
            {bottomHighlight}
          </NameSectionStyle>
          <InfoSectionStyle restricted={restricted}>
            {renderLozenge(lozenge)}
            {renderTime(time)}
          </InfoSectionStyle>
          {restricted ? (
            <NoAccessTooltip name={name!}>
              <AccessSectionStyle>
                <NoAccessLabel>
                  {text => (
                    <LockCircleIcon label={text as string} />
                  ) /* safe to cast to string given there is no value binding */}
                </NoAccessLabel>
              </AccessSectionStyle>
            </NoAccessTooltip>
          ) : null}
        </RowStyle>
      </MentionItemStyle>
    );
  }
}

const messages = {
  memberCount: {
    id: 'fabric.elements.user-picker.team.member.count',
    defaultMessage:
      '{count} {count, plural, one {member} other {members}}{includes, select, true {, including you} other {}}',
    description:
      'Number of members in the team and whether it includes the current user',
  },
  plus50Members: {
    id: 'fabric.elements.user-picker.team.member.50plus',
    defaultMessage:
      '50+ members{includes, select, true {, including you} other {}}',
    description:
      'Number of members in a team exceeds 50 and whether it includes the current user',
  },
};
