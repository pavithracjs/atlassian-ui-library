import { ICON_SIZES } from '../styled/constants';
import { AvatarPropTypes } from '../types';

export const validIconSizes: string[] = Object.keys(ICON_SIZES);

export const propsOmittedFromClickData: Array<keyof AvatarPropTypes> = [
  'onBlur',
  'onClick',
  'onFocus',
  'onKeyDown',
  'onKeyUp',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseUp',
];
