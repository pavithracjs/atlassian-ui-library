import { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { fontFamily } from '@atlaskit/theme/constants';
import { B50, B100, N300, N20A } from '@atlaskit/theme/colors';
import { borderRadius } from '../../mixins';

export interface FrameProps {
  minWidth?: number;
  maxWidth?: number;
  isInteractive?: boolean;
  isSelected?: boolean;
}

function minWidth({ minWidth }: FrameProps) {
  if (minWidth) {
    return `min-width: ${minWidth}px;`;
  } else {
    return '';
  }
}

function maxWidth({ maxWidth }: FrameProps) {
  if (maxWidth) {
    return `max-width: ${maxWidth}px;`;
  } else {
    return '';
  }
}

function interactive({ isInteractive }: FrameProps) {
  if (isInteractive) {
    return `
      cursor: pointer;
      :hover {
        background-color: ${B50};
      }
    `;
  } else {
    return '';
  }
}

function selected({ isSelected }: FrameProps) {
  return isSelected
    ? `&::after {
        cursor: pointer;
        box-shadow: 0 0 0 2px ${B100};
        content: '';
        outline: none;
        position: absolute;
        height: 100%;
        width: 100%;
        left: 0;
      }`
    : '';
}

export const Wrapper: React.ComponentClass<
  FrameProps & HTMLAttributes<{}>
> = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 40px;
  color: ${N300};
  font-family: ${fontFamily};
  font-size: 12px;
  font-weight: 500;
  border-radius: 3px;
  background-color: ${N20A};
  position: relative;
  ${borderRadius} ${minWidth} ${maxWidth} ${interactive};
  ${selected}
`;

export const Icon: React.ComponentClass<HTMLAttributes<{}>> = styled.span`
  display: inline-flex;
`;

export const Text: React.ComponentClass<HTMLAttributes<{}>> = styled.span`
  margin-left: 12px;
`;
