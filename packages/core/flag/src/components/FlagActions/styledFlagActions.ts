import styled, { css } from 'styled-components';
import { gridSize, math } from '@atlaskit/theme';

import { DEFAULT_APPEARANCE } from '../Flag';
import { flagTextColor } from '../../theme';

// Outputs the styles for actions separator: mid-dot for non-bold flags, or space for bold flags.
const getDivider = ({
  hasDivider,
  useMidDot,
}: {
  hasDivider: boolean;
  useMidDot: boolean;
}) => css`
  display: ${hasDivider ? 'inline-block' : 'none'};
  content: "${useMidDot ? '\u00B7' : ''}";
  width: ${useMidDot ? math.multiply(gridSize, 2) : gridSize}px;
`;

export default styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: ${gridSize}px;
  transform: ${({ appearance }: { appearance: string }) =>
    appearance === DEFAULT_APPEARANCE ? `translateX(-${gridSize() / 2}px)` : 0};
`;

export const Action = styled.div`
  &::before {
    color: ${flagTextColor};
    text-align: center;
    vertical-align: middle;

    ${getDivider};
  }
`;
