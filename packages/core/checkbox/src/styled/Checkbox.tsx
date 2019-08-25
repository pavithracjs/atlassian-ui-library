/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { themed } from '@atlaskit/theme/components';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';
import { multiply } from '@atlaskit/theme/math';
import React from 'react';

export const HiddenCheckbox = React.forwardRef((
  // @ts-ignore - createAnalyticsEvent is injected from WithAnalyticsEvents HOC
  { createAnalyticsEvent, ...props }: React.HTMLProps<HTMLInputElement>,
  ref: React.Ref<HTMLInputElement>,
) => (
  <input
    ref={ref}
    css={css`
      left: 50%;
      margin: 0;
      opacity: 0;
      padding: 0;
      position: absolute;
      transform: translate(-50%, -50%);
      top: 50%;
    `}
    {...props}
  />
));

const disabledColor = themed({ light: colors.N80, dark: colors.N80 });

interface Props {
  isActive?: boolean;
  isChecked?: boolean | unknown;
  isDisabled?: boolean;
  isFocused?: boolean;
  isInvalid?: boolean;
  isHovered?: boolean;
  rest?: any;
}

interface LabelProps extends React.HTMLProps<HTMLLabelElement> {
  isDisabled?: boolean;
}
export const Label = ({ isDisabled, ...rest }: LabelProps) => (
  <label
    css={css`
      align-items: flex-start;
      display: flex;
      color: ${isDisabled ? disabledColor(rest) : colors.text(rest)};
      ${isDisabled
        ? css`
            cursor: not-allowed;
          `
        : ''};
    `}
    {...rest}
  />
);

const borderColor = themed({ light: colors.N40, dark: colors.DN80 });
const activeBorder = css`
  stroke: currentColor;
  stroke-width: 2px;
`;
const checkedBorder = css`
  stroke: currentColor;
  stroke-width: 2px;
`;
const focusBorder = (props: Props) => css`
  stroke: ${themed({ light: colors.B100, dark: colors.B75 })(props)};
  stroke-width: 2px;
`;
const invalidBorder = (props: Props) => css`
  stroke: ${themed({ light: colors.R300, dark: colors.R300 })(props)};
  stroke-width: 2px;
`;

const border = ({ isHovered, ...rest }: Props) => css`
  stroke: ${isHovered
    ? themed({ light: colors.N40, dark: colors.DN200 })(rest)
    : borderColor(rest)};
  stroke-width: 2px;
`;

const getBorderColor = (props: Props) => {
  if (props.isDisabled) {
    return '';
  }
  if (props.isActive) {
    return activeBorder;
  }
  if (props.isChecked) {
    return checkedBorder;
  }
  if (props.isFocused) {
    return focusBorder(props);
  }
  if (props.isInvalid) {
    return invalidBorder(props);
  }
  return border(props);
};

const getTickColor = (props: Props) => {
  const { isChecked, isDisabled, isActive, ...rest } = props;

  let color = themed({ light: colors.N10, dark: colors.DN10 });

  if (isDisabled && isChecked) {
    color = themed({ light: colors.N70, dark: colors.DN90 });
  } else if (isActive && isChecked && !isDisabled) {
    color = themed({ light: colors.B400, dark: colors.DN10 });
  } else if (!isChecked) {
    color = themed({ light: 'transparent', dark: 'transparent' });
  }
  return color(rest);
};

const getBoxColor = (props: Props) => {
  const { isChecked, isDisabled, isActive, isHovered, ...rest } = props;
  // set the default
  let color = themed({ light: colors.N10, dark: colors.DN10 });

  if (isDisabled) {
    color = themed({ light: colors.N20, dark: colors.DN10 });
  } else if (isActive) {
    color = themed({ light: colors.B50, dark: colors.B200 });
  } else if (isHovered && isChecked) {
    color = themed({ light: colors.B300, dark: colors.B75 });
  } else if (isHovered) {
    color = themed({ light: colors.N30, dark: colors.DN30 });
  } else if (isChecked) {
    color = themed({ light: colors.B400, dark: colors.B400 });
  }
  return color(rest);
};

export const LabelText = (props: { children: React.ReactNode }) => (
  <span
    css={css`
      padding: 2px 4px;
    `}
    {...props}
  />
);

export const CheckboxWrapper = (props: { children: React.ReactNode }) => (
  <span
    css={css`
      display: flex;
      flex-shrink: 0;
      position: relative;
    `}
    {...props}
  />
);

interface IconProps extends React.HTMLProps<HTMLLabelElement> {
  isChecked?: boolean;
  isDisabled?: boolean;
  isActive?: boolean;
  isHovered?: boolean;
  isFocused?: boolean;
  isInvalid?: boolean;
}
export const IconWrapper = ({ children, ...props }: IconProps) => (
  <span
    css={css`
      line-height: 0;
      flex-shrink: 0;
      color: ${getBoxColor(props)};
      fill: ${getTickColor(props)};
      transition: all 0.2s ease-in-out;

      /* This is adding a property to the inner svg, to add a border to the checkbox */
      & rect:first-of-type {
        transition: stroke 0.2s ease-in-out;
        ${getBorderColor(props)};
      }

      /**
      * Need to set the Icon component wrapper to flex to avoid a scrollbar bug which
      * happens when checkboxes are flex items in a parent with overflow.
      * See AK-6321 for more details.
      **/
      > span {
        display: flex;
      }
    `}
    children={children}
  />
);

export type RequiredIndicatorProps = {
  'aria-hidden'?: boolean | 'true' | 'false';
} & React.AllHTMLAttributes<HTMLSpanElement>;

export const RequiredIndicator = (props: RequiredIndicatorProps) => (
  <span
    css={css`
      color: ${colors.R400};
      padding-left: ${multiply(gridSize, 0.25)}px;
    `}
    {...props}
  />
);
