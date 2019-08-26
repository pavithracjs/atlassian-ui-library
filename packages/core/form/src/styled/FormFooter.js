// @flow
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { multiply } from '@atlaskit/theme/math';

/**
 * Provide a styled container for form headers.
 */
export const FormFooterWrapper = styled.footer`
  margin-top: ${multiply(gridSize, 3)}px;
  display: flex;
  justify-content: flex-end;
`;
