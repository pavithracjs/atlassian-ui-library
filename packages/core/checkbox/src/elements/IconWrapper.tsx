/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ThemeTokens, ThemeIconTokens } from '../types';
import React from 'react';

interface Props {
  isActive?: boolean;
  isChecked?: boolean | unknown;
  isDisabled?: boolean;
  isFocused?: boolean;
  isInvalid?: boolean;
  isHovered?: boolean;
  rest?: any;
  tokens: ThemeTokens;
}

const disabledBorder = (iconTokens: ThemeIconTokens) => ({
  stroke: iconTokens.borderColor.disabled,
  strokeWidth: iconTokens.borderWidth,
});

const activeBorder = (iconTokens: ThemeIconTokens) => ({
  stroke: iconTokens.borderColor.active,
  strokeWidth: iconTokens.borderWidth,
});

const checkedBorder = (iconTokens: ThemeIconTokens) => ({
  stroke: iconTokens.borderColor.checked,
  strokeWidth: iconTokens.borderWidth,
});

const focusBorder = (iconTokens: ThemeIconTokens) => ({
  stroke: iconTokens.borderColor.focused,
  strokeWidth: iconTokens.borderWidth,
});

const invalidBorder = (iconTokens: ThemeIconTokens) => ({
  stroke: iconTokens.borderColor.invalid,
  strokeWidth: iconTokens.borderWidth,
});

const border = ({ isHovered, tokens: { icon } }: Props) => ({
  stroke: isHovered ? icon.borderColor.hovered : icon.borderColor.rest,
  strokeWidth: icon.borderWidth,
});

const getBorderColor = ({ tokens, ...props }: Props) => {
  if (props.isDisabled) {
    return disabledBorder(tokens.icon);
  }
  if (props.isActive) {
    return activeBorder(tokens.icon);
  }
  if (props.isChecked) {
    return checkedBorder(tokens.icon);
  }
  if (props.isFocused) {
    return focusBorder(tokens.icon);
  }
  if (props.isInvalid) {
    return invalidBorder(tokens.icon);
  }
  return border({ tokens, ...props });
};

const getTickColor = (props: Props) => {
  const {
    isChecked,
    isDisabled,
    isActive,
    tokens: { icon },
  } = props;

  let color = icon.tickColor.checked;

  if (isDisabled && isChecked) {
    color = icon.tickColor.disabledAndChecked;
  } else if (isActive && isChecked && !isDisabled) {
    color = icon.tickColor.activeAndChecked;
  } else if (!isChecked) {
    color = icon.tickColor.rest;
  }
  return color;
};

const getBoxColor = (props: Props) => {
  const {
    isChecked,
    isDisabled,
    isActive,
    isHovered,
    tokens: { icon },
  } = props;
  // set the default
  let color = icon.boxColor.rest;

  if (isDisabled) {
    color = icon.boxColor.disabled;
  } else if (isActive) {
    color = icon.boxColor.active;
  } else if (isHovered && isChecked) {
    color = icon.boxColor.hoveredAndChecked;
  } else if (isHovered) {
    color = icon.boxColor.hovered;
  } else if (isChecked) {
    color = icon.boxColor.checked;
  }
  return color;
};

export interface IconProps extends React.HTMLProps<HTMLLabelElement> {
  tokens: ThemeTokens;
  isChecked?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  isInvalid?: boolean;
}

export default ({ children, ...props }: IconProps) => (
  <span
    css={{
      lineHeight: 0,
      flexShrink: 0,
      color: getBoxColor(props),
      fill: getTickColor(props),
      transition: 'all 0.2s ease-in-out;',

      /* This is adding a property to the inner svg, to add a border to the checkbox */
      '& rect:first-of-type': {
        transition: 'stroke 0.2s ease-in-out;',
        ...getBorderColor(props),
      },

      /**
       * Need to set the Icon component wrapper to flex to avoid a scrollbar bug which
       * happens when checkboxes are flex items in a parent with overflow.
       * See AK-6321 for more details.
       **/
      '> span': {
        display: 'flex',
      },
    }}
    children={children}
  />
);
