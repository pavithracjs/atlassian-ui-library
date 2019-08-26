/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

interface ArticleContainerProps {
  isSearchVisible: boolean;
}

export const ArticleContainer = styled.div<ArticleContainerProps>`
  position: absolute;
  height: ${props =>
    props.isSearchVisible
      ? `calc(100% - ${13 * gridSize()}px)`
      : `calc(100% - ${6 * gridSize()}px)`};
  width: 100%;
  background-color: #ffffff;
  top: ${props =>
    props.isSearchVisible ? `${13 * gridSize()}px` : `${6 * gridSize()}px`};
  left: 100%;
  flex: 1;
  flex-direction: column;
  padding: ${gridSize() * 2}px ${gridSize() * 3}px ${gridSize() * 2}px
    ${gridSize() * 3}px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
`;

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

export const ToggleShowMoreArticles = styled.a`
  padding-top: ${gridSize()}px;
  display: inline-block;
  cursor: pointer;
`;
