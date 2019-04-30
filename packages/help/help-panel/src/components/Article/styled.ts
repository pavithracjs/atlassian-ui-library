import styled from '@emotion/styled';
import { colors, gridSize } from '@atlaskit/theme';

export const SelectedIcon = styled.div`
  margin-top: 0.3em;
`;

export const ArticleContentInner = styled.div`
  padding-bottom: ${2 * gridSize()}px;
  position: relative;
`;

export const ArticleContentTitle = styled.div`
  padding-bottom: ${2 * gridSize()}px;
`;

export const ArticleRateText = styled.div`
  font-size: 0.75rem;
  font-weight: bold;
  color: ${colors.N200};
  line-height: ${gridSize() * 2}px;
  position: relative;
  display: inline-block;
`;

export const ArticleRateAnswerWrapper = styled.div`
  padding-top: ${gridSize() * 2}px;
`;
