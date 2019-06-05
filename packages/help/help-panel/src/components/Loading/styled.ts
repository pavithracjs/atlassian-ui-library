/** @jsx jsx */
import styled from '@emotion/styled';
import { keyframes } from '@emotion/core';
import * as colors from '@atlaskit/theme/colors';

type LoadingRectangleProps = {
  contentWidth?: string;
  contentHeight?: string;
  marginTop?: string;
};

const shimmer = keyframes`
    0% {
        background-position: -300px 0;
    }
    100% {
        background-position: 1000px 0;
    }
`;

export const LoadingRectangle = styled.div<LoadingRectangleProps>`
  position: relative;
  height: ${props => (props.contentHeight ? props.contentHeight : '1rem')};
  margin-top: ${props =>
    props.marginTop ? props.marginTop : '0.42857142857143rem'};
  width: ${props => (props.contentWidth ? props.contentWidth : '100%')};
  border-radius: 2px;
  animation-duration: 1.2s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: ${shimmer};
  animation-timing-function: linear;
  background-color: ${colors.N30};
  background-image: linear-gradient(
    to right,
    ${colors.N30} 10%,
    ${colors.N40} 20%,
    ${colors.N30} 30%
  );
  background-repeat: no-repeat;
`;

export const LoadignRelatedArticleSection = styled.div`
  margin-top: 1.5rem;
`;

export const LoadignRelatedArticleList = styled.ul`
  width: 100%;
  margin: 0;
  padding: 0;
`;

export const LoadignRelatedArticleListItem = styled.li`
  margin-top: 1rem;
  display: inline-block;
  width: 100%;

  & > div {
    display: inline-block;
  }
`;

export const LoadignRelatedArticleListItemText = styled.div`
  width: calc(100% - (40px + 0.5rem));
  margin-left: 0.5rem;
`;
