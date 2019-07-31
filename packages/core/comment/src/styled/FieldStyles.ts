import styled, { css } from 'styled-components';
import { colors } from '@atlaskit/theme';

const ThemeColor = {
  text: colors.N500,
};

interface CommonProps {
  hasAuthor?: boolean;
}
const common = ({ hasAuthor }: commonProps) => css`
  &:not(:hover):not(:active) {
    color: ${ThemeColor.text};
  }
  font-weight: ${hasAuthor ? 500 : 'inherit'};
`;

export const Anchor = styled.a`
  ${(p: commonProps) => common(p)};
`;
export const Span = styled.span`
  ${(p: commonProps) => common(p)};
`;
