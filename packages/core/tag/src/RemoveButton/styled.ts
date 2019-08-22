import styled from 'styled-components';
import { themed } from '@atlaskit/theme/components';
import { borderRadius } from '@atlaskit/theme/constants';
import { R300, R200, N500, R500 } from '@atlaskit/theme/colors';
import { buttonWidthUnitless, focusRingColor } from '../constants';

const focusColor = themed({ light: R300, dark: R200 });

// NOTE:
// "-moz-focus-inner" removes some inbuilt padding that Firefox adds (taken from reduced-ui-pack)
// the focus ring is red unless combined with hover, then uses default blue
export const Button = styled.button`
  align-items: center;
  align-self: center;
  appearance: none;
  background: none;
  border: none;
  border-radius: ${({ isRounded }: { isRounded: boolean }) =>
    isRounded ? `${buttonWidthUnitless / 2}px` : `${borderRadius()}px`};
  color: ${N500};
  display: flex;
  justify-content: center;
  height: 16px;
  margin: 0;
  padding: 0;

  &::-moz-focus-inner {
    border: 0;
    margin: 0;
    padding: 0;
  }

  &:focus {
    box-shadow: 0 0 0 2px ${focusColor};
    outline: none;
  }

  &:hover {
    color: ${R500};

    &:focus {
      box-shadow: 0 0 0 2px ${focusRingColor};
      outline: none;
    }
  }
`;
