import * as React from 'react';
import FormattedMessage from '../primitives/formatted-message';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
import messages from '../utils/messages';

const ExpandText = styled.span`
  display: inline-block;
  font-size: 12px;
  vertical-align: top;
`;

export const SectionTitleWrapper = styled.div`
  display: flex;
  a {
    padding: 0px;
    & span {
      font-weight: normal;
      text-transform: none;
      margin-right: 0px !important;
    }
    > span {
      margin-top: -3px;
    }
  }
`;
export const SectionTitleBlock = styled.div`
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  & + & {
    text-align: right;
  }
`;

interface ExpandLinkProps {
  title: React.ReactNode;
  href: string;
}

export default ({ title, href }: ExpandLinkProps) => {
  const translatedString = <FormattedMessage {...messages.expand} />;
  return (
    <SectionTitleWrapper>
      <SectionTitleBlock>{title}</SectionTitleBlock>
      <SectionTitleBlock>
        <Button
          appearance="link"
          spacing="compact"
          iconAfter={
            <ShortcutIcon
              size="small"
              label={
                typeof translatedString === 'string'
                  ? translatedString
                  : 'Expand'
              }
            />
          }
          href={href}
        >
          <ExpandText>{translatedString}</ExpandText>
        </Button>
      </SectionTitleBlock>
    </SectionTitleWrapper>
  );
};
