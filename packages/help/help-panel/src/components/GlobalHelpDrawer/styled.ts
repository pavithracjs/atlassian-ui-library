import styled from 'styled-components';
import { colors, layers, gridSize } from '@atlaskit/theme';

export const HelpDrawer = styled.div`
  background-color: white;
  display: flex;
  height: 100vh;
  right: 0;
  position: fixed;
  top: 0;
  border-left: 3px solid ${colors.N30}
  width: ${60 * gridSize()}px;
  z-index: ${layers.blanket() + 1};
`;

export const HelpDrawerContent = styled.div`
  flex: 1;
  overflow: auto;
  flex-direction: column;
  padding: ${gridSize() * 4}px ${gridSize() * 4}px 0 ${gridSize() * 4}px;
  width: 100%;
  overflow-y: auto;
`;
