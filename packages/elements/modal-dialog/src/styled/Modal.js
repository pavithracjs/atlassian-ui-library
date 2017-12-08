import styled, { css } from 'styled-components';
import { borderRadius, colors, themed } from '@atlaskit/theme';
import { WIDTH_ENUM } from '../shared-variables';

import {
  flexMaxHeightIEFix,
  IEMaxHeightCalcPx,
} from '../utils/flex-max-height-ie-fix';

const boxShadow = ({ isChromeless }) =>
  isChromeless
    ? 'none'
    : `
    0 0 0 1px ${colors.N30A}, 0 2px 1px ${colors.N30A},
    0 0 20px -6px ${colors.N60A}
  `;
const dialogBgColor = ({ isChromeless }) =>
  isChromeless
    ? 'transparent'
    : themed({ light: colors.N0, dark: colors.DN50 });
const gutter = 60;
const maxDimensions = css`calc(100% - ${gutter * 2}px)`;
const maxHeightDimensions = css`calc(100% - ${gutter * 2 -
  IEMaxHeightCalcPx}px)`;

export const dialogWidth = ({ widthName, widthValue }) => {
  if (typeof widthValue === 'number') {
    return `${widthValue}px`;
  }

  return widthName ? `${WIDTH_ENUM.widths[widthName]}px` : widthValue || 'auto';
};
export const dialogHeight = ({ heightValue }) => {
  if (typeof heightValue === 'number') {
    return `${heightValue}px`;
  }

  return heightValue || 'auto';
};

/**
  NOTE:
  z-index
  - temporarily added to beat @atlaskit/navigation

  absolute + top
  - rather than fixed position so popper.js children are properly positioned

  overflow-y
  - only active when popper.js children envoked below the dialog
*/
export const FillScreen = styled.div`
  height: 100%;
  left: 0;
  overflow-y: auto;
  position: absolute;
  top: ${p => p.scrollDistance}px;
  width: 100%;
  z-index: 300;
  -webkit-overflow-scrolling: touch;
`;

export const PositionerAbsolute = styled.div`
  display: flex;
  flex-direction: column;
  height: ${maxHeightDimensions};
  left: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: ${maxDimensions};
  position: absolute;
  right: 0;
  top: ${gutter}px;
  width: ${dialogWidth};
`;
export const PositionerRelative = styled.div`
  margin: ${gutter}px auto;
  position: relative;
  width: ${dialogWidth};
`;

export const Dialog = styled.div`
  ${p =>
    p.isChromeless
      ? null
      : css`
          background-color: ${dialogBgColor};
          border-radius: ${borderRadius}px;
          box-shadow: ${boxShadow};
        `} color: ${colors.text};
  display: flex;
  flex-direction: column;
  height: ${dialogHeight};
  ${flexMaxHeightIEFix};
  outline: 0;
`;

PositionerAbsolute.displayName = 'PositionerAbsolute';
Dialog.displayName = 'Dialog';
FillScreen.displayName = 'FillScreen';
PositionerRelative.displayName = 'PositionerRelative';
