import { css } from '@emotion/core';
import { AppNavigationTheme } from '../theme';
import { CREATE_BREAKPOINT } from './constants';

export const actionSectionDesktopStyles = css`
  @media (max-width: ${CREATE_BREAKPOINT - 1}px) {
    display: none;
  }
`;

export const actionSectionMobileStyles = css`
  @media (min-width: ${CREATE_BREAKPOINT}px) {
    display: none;
  }
`;

export const skeletonStyles = ({ mode: { skeleton } }: AppNavigationTheme) => ({
  opacity: 0.15,
  ...skeleton,
});
