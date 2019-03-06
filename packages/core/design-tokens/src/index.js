// @flow
import {
  B100,
  N0,
  B50,
  N30,
  N900,
  N800,
  B400,
  N200,
  N100,
  N20,
  B300,
  B500,
  T300,
  P300,
  R300,
  Y300,
  G300,
  spacing,
} from './options';

// FOCUS
export const noFocusRing = 'box-shadow: none';
export const focusRing = (
  color: string = B100,
  outlineWidth: number = spacing['grid_0.25x'],
) => `
  &:focus {
    outline: none;
    box-shadow: 0px 0px 0px ${outlineWidth}px ${color};
  }
`;

// Themed colors
export const background = N0;
export const backgroundActive = B50;
export const backgroundHover = N30;
export const backgroundOnLayer = N0;

export const text = N900;
export const textHover = N800;
export const textActive = B400;
export const subtleText = N200;
export const placeholderText = N100;
export const heading = N800;
export const subtleHeading = N200;
export const codeBlock = N20;
export const link = B400;
export const linkHover = B300;
export const linkActive = B500;
export const linkOutline = B100;

export const primary = B400;

export const blue = B400; // 1
export const teal = T300; // 0
export const purple = P300; // 1
export const red = R300; // 0
export const yellow = Y300; // 1
export const green = G300; // 0
