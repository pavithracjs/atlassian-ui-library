// @flow
import { B100, spacing } from './options';

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
