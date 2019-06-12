/** @jsx jsx */
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { panelWidth, panelBorderWidth } from './constants';

export const HelpDrawer = styled.div`
  background-color: white;
  width: ${panelWidth}px;
  flex: 0 0 ${panelWidth}px;
  position relative;
  overflow: hidden;
`;

export const HelpDrawerContent = styled.div`
  flex: 1;
  border-left: ${panelBorderWidth}px solid ${colors.N30};
  overflow: hidden;
  flex-direction: column;
  width: ${panelWidth - panelBorderWidth}px;
  height: 100%;
  position: fixed;
`;
