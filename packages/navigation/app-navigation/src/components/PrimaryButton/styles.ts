import { B400, B50 } from '@atlaskit/theme/colors';
import {
  fontSizeSmall,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import css from '@emotion/css';
import styled from '@emotion/styled';
import { globalSkeletonStyles } from '../../common/styles';

const gridSize = gridSizeFn();

export const chevronStyles = css`
  margin: 0 -${gridSize}px;
  visibility: hidden;
`;

const buttonHeight = gridSize * 4;
const margin = {
  left: gridSize / 2,
};
const padding = {
  all: gridSize / 2,
};

// TODO marginRight
export const primaryButtonTheme: any = (
  currentTheme: Function,
  themeProps: { appearance: string },
) => {
  const { buttonStyles, spinnerStyles } = currentTheme(themeProps);
  return {
    buttonStyles: {
      ...buttonStyles,
      backgroundColor: 'transparent',
      color: B50,
      display: 'inline-flex',
      fontSize: fontSizeSmall(),
      fontWeight: 'bold',
      height: buttonHeight,
      marginLeft: margin.left,
      padding: padding.all,
      textTransform: 'uppercase',
      ':hover, :focus': {
        backgroundColor: B400,
      },
      ':hover .chevron, :focus .chevron': {
        visibility: 'visible',
      },
    },
    spinnerStyles,
  };
};

export const PrimaryButtonSkeleton = styled.div`
  display: inline-flex;
  width: 68px;
  height: ${buttonHeight - padding.all * 2.5}px;
  border-radius: ${gridSize / 2}px;
  margin-left: ${margin.left + padding.all * 2}px;
  margin-right: 12px;
  ${globalSkeletonStyles};
`;
