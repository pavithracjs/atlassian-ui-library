/** @jsx jsx */
import styled from '@emotion/styled';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const ArticlesListItemWrapper = styled.a`
  box-sizing: border-box;
  padding: ${gridSize() * 2}px ${gridSize() * 2}px ${gridSize() * 2}px
    ${gridSize() * 1.5}px;
  display: block;
  text-decoration: none;
  cursor: pointer;
  color: ${colors.N200};
  border-radius: 3px;

  &:hover,
  &:focus,
  &:visited,
  &:active {
    text-decoration: none;
    outline: none;
    outline-offset: none;
  }

  &:focus {
    box-shadow: ${colors.B100} 0px 0px 0px 2px inset;
  }

  &:hover {
    background: ${colors.backgroundHover};
  }

  &:active {
    background: ${colors.backgroundActive};
  }
`;

export const ArticlesListItemTitle = styled.div`
  width: 100%;
  white-space: nowrap;
`;

export const ArticlesListItemTitleIcon = styled.div`
  align-self: auto;
  padding-right: ${gridSize()}px;
  display: inline-block;
  vertical-align: top;
`;

export const ArticlesListItemTitleText = styled.span`
  text-decoration: none;
  color: ${colors.N800};
  font-size: ${fontSize()}px;
  font-weight: 600;
  display: inline-block;
  vertical-align: top;
  line-height: ${gridSize() * 3}px;
  white-space: normal;
`;

export const ArticlesListItemDescription = styled.p`
  display: block;
  color: ${colors.N400};
  padding-left: ${gridSize() * 4}px;
  max-height: 3.6rem;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;
