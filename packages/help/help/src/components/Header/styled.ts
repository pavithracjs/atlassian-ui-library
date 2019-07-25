/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

const HEADER_TITLE_BORDER_BOTTOM = 2;

export const HeaderContainer = styled.div`
  flex: 1;
  overflow: auto;
  flex-direction: column;
  background-color: ${colors.N10};
  border-bottom: ${HEADER_TITLE_BORDER_BOTTOM}px solid ${colors.N30};
  height: ${gridSize() * 6}px;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: stretch;
  flex-flow: row nowrap;
  justify-content: space-between;
  box-sizing: border-box;
`;

export const CloseButtonContainer = styled.div`
  position: absolute;
  right: ${gridSize()}px;
  top: ${gridSize()}px;
`;

export const BackButtonContainer = styled.div`
  position: absolute;
  top: ${gridSize()}px;
  left: ${gridSize()}px;
`;

export const HeaderTitle = styled.div`
  color: ${colors.H500};
  text-align: center;
  font-size: 1rem;
  padding-top: ${gridSize() - HEADER_TITLE_BORDER_BOTTOM / 2}px;
  height: ${gridSize() * 4}px;
  line-height: ${gridSize() * 4}px;
  width: 100%;
`;
