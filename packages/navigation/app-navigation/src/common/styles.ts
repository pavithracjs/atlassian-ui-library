import { css } from '@emotion/core';
import { N50 } from '@atlaskit/theme/colors';
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

export const globalSkeletonStyles = css`
  background: ${N50};
  opacity: 0.5;
`;
