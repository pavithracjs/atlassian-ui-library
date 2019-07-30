/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';

export const ExampleWrapper = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 100%;
`;

export const ButtonsWrapper = styled.div`
  padding: ${gridSize() * 2}px;
`;

export const HelpWrapper = styled.div`
  width: ${gridSize() * 46}px;
  position: relative;
  overflow-x: hidden;
`;
