import isPropValid from '@emotion/is-prop-valid';
import { ButtonProps, ThemeProps } from '../types';
import { applyPropertyStyle } from '../theme';

const initialTokens: { [key: string]: string } = {};

export const tokenApplicator = (
  properties: string[],
  themeProps: ThemeProps,
  theme: {},
) =>
  properties.reduce((acc, p) => {
    acc[p] = applyPropertyStyle(p, themeProps, theme);
    return acc;
  }, initialTokens);

export const mapAttributesToState = ({
  isDisabled,
  isActive,
  isFocus,
  isHover,
  isSelected,
}: {
  isDisabled: boolean;
  isActive: boolean;
  isFocus: boolean;
  isHover: boolean;
  isSelected: boolean;
}) => {
  if (isDisabled) return 'disabled';
  if (isSelected && isFocus) return 'focusSelected';
  if (isSelected) return 'selected';
  if (isActive) return 'active';
  if (isHover) return 'hover';
  if (isFocus) return 'focus';
  return 'default';
};

export const filteredProps = (props: ButtonProps) =>
  (Object.keys(props) as Array<keyof ButtonProps>)
    .filter(isPropValid) // Checks for valid DOM properties.
    .reduce(
      (validProps, prop) => ({
        ...validProps,
        [prop]: props[prop],
      }),
      {},
    );
