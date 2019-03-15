import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

export const SelectedIcon = styled.div`
  margin-top: 0.3em;
`;

export const ArticleContentInner = styled.div`
  padding-top: ${3 * gridSize()}px;
  position: relative;
`;

export const ArticleVoteInner = styled.div`
  font-size: 0.75rem;
  color: ${colors.N200};
  line-height: ${gridSize() * 2}px;
  position: relative;
`;
