import styled, { css } from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';

const ItemGroupTitleSize = 11;

export const truncate = (width: string = '100%') => css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${width};
`;

export const CloseButton = styled.button`
  color: ${colors.N100};
  cursor: pointer;
  width: 24px;
  height: 24px;
  min-width: 24px;
  border: none;
  padding: 0;
`;

export const ItemGroupTitle = styled.div`
  color: ${colors.N200};
  font-size: ${ItemGroupTitleSize}px;
  line-height: ${(gridSize() * 2) / ItemGroupTitleSize};
  font-weight: 600;
  ${truncate()}
`;

export const HelpPanelHeader = styled.div`
  flex: 1;
  overflow: auto;
  flex-direction: column;
  border-bottom: 2px solid ${colors.N30}
  padding: ${gridSize()}px ${gridSize() * 3}px;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: stretch;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

export const HelpPanelHeaderText = styled.div`
  color: ${colors.N100};
  font-weight: bold;
  height: 24px;
  line-height: 24px;
  width: 100%;
`;

export const BackButton = styled.button`
  color: ${colors.N100};
  align-items: center;
  background: 0;
  border: 0;
  cursor: pointer;
  display: flex;
  font-size: inherit;
  height: 24px;
  justify-content: left;
  line-height: 24px;
  padding: 0;
  font-weight: bold;
`;

export const BackButtonText = styled.span`
  height: 26px;
`;

export const HelpPanelBody = styled.div`
  flex: 1;
  overflow: auto;
  flex-direction: column;
  padding: ${gridSize() * 2}px ${gridSize() * 3}px ${gridSize() * 2}px
    ${gridSize() * 3}px;
  overflow-y: auto;
  height: calc(100vh - 58px - ${gridSize() * 2}px);
`;
