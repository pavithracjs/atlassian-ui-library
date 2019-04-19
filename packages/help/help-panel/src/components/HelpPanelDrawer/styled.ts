import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

export const HelpDrawer = styled.div`
  background-color: white;
  width: ${60 * gridSize()}px;
  flex: 0 0 ${60 * gridSize()}px;
  position relative;
`;

export const HelpDrawerContent = styled.div`
  flex: 1;
  border-left: 3px solid ${colors.N30}
  overflow: auto;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  position: fixed;
`;
