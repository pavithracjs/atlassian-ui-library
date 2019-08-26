import styled from 'styled-components';
import { fontSize, gridSize } from '@atlaskit/theme/constants';
import { N0, N50A, N60A } from '@atlaskit/theme/colors';

const gridSizeUnitless = gridSize();

const ButtonWrapper = styled.div`
  background-color: ${N0};
  border-radius: ${gridSizeUnitless / 2 - 1}px;
  box-shadow: 0 ${gridSizeUnitless / 2}px ${gridSizeUnitless}px -${gridSizeUnitless /
        4}px ${N50A},
    0 0 1px ${N60A};
  box-sizing: border-box;
  font-size: ${fontSize()}px;
  width: ${gridSizeUnitless * 4}px;
  z-index: 200;

  &:last-child {
    margin-left: ${gridSizeUnitless / 2}px;
  }
`;

ButtonWrapper.displayName = 'ButtonWrapper';

export default ButtonWrapper;
