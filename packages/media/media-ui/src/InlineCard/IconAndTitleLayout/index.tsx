import * as React from 'react';
import {
  IconTitleWrapper,
  IconWrapper,
  IconTitleHeadNoBreakWrapper,
} from './styled';
import { Icon } from '../Icon';

export interface IconAndTitleLayoutProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  right?: React.ReactNode;
}

const CHAR_LENGTH_BREAK_AT = 7;

export class IconAndTitleLayout extends React.Component<
  IconAndTitleLayoutProps
> {
  renderIcon() {
    const { icon } = this.props;
    // We render two kinds of icons here:
    // - Image: acquired from either DAC or Teamwork Platform Apps;
    // - Atlaskit Icon: an Atlaskit SVG;
    // Each of these are scaled down to 12x12.
    if (icon) {
      if (typeof icon === 'string') {
        return <Icon src={icon} />;
      } else {
        return <IconWrapper>{icon}</IconWrapper>;
      }
    }
    return null;
  }

  render() {
    const { title } = this.props;

    // Check our text is actually a title text and not an element (e.g. as in UnauthorizedView)
    if (typeof title === 'string') {
      const head = title.slice(0, CHAR_LENGTH_BREAK_AT);
      const rest = title.slice(CHAR_LENGTH_BREAK_AT);

      return (
        <>
          <IconTitleWrapper>
            <IconTitleHeadNoBreakWrapper>
              {this.renderIcon()}
              {head}
            </IconTitleHeadNoBreakWrapper>
            {rest}
          </IconTitleWrapper>
        </>
      );
    }

    return (
      <>
        <IconTitleWrapper>
          {this.renderIcon()}
          {'\u00A0'}
          {title}
        </IconTitleWrapper>
      </>
    );
  }
}
