/** @jsx jsx */
import styled from '@emotion/styled';
import * as colors from '@atlaskit/theme/colors';
import { panelWidth } from './constants';

export const HelpDrawer = styled.div`
  background-color: white;
  width: ${panelWidth}px;
  flex: 0 0 ${panelWidth}px;
  position relative;
`;

export const HelpDrawerContent = styled.div`
  flex: 1;
  border-left: 3px solid ${colors.N30};
  overflow: auto;
  flex-direction: column;
  width: ${panelWidth}px;
  height: 100%;
  overflow-y: auto;
  position: fixed;
`;
