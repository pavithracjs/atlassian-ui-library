import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { colors, themed, withTheme } from '@atlaskit/theme';
import { Theme } from '../theme';
import { AppearanceType, SizeType } from '../types';

export const ShapeGroup = withTheme(styled.g`
  & circle,
  & rect {
    fill: ${themed({ light: colors.N50, dark: colors.DN100 })};
  }
  & g {
    fill: ${colors.background};
  }
`);

interface SlotProps {
  appearance: AppearanceType;
  isLoading: boolean;
  size: SizeType;
  role: string;
  label?: string;
  backgroundImage?: string;
}

export const Slot = ({
  isLoading,
  appearance,
  size,
  backgroundImage,
  label,
  role,
}: SlotProps) => (
  <Theme.Consumer appearance={appearance} isLoading={isLoading} size={size}>
    {({ backgroundColor, borderRadius }) => {
      return (
        <span
          style={{
            backgroundColor,
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : undefined,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            borderRadius,
            display: 'flex',
            flex: '1 1 100%',
            height: '100%',
            width: '100%',
          }}
          role={role}
          aria-label={label}
        />
      );
    }}
  </Theme.Consumer>
);

interface SvgProps {
  appearance: AppearanceType;
  isLoading: boolean;
  size: SizeType;
  children: ReactNode;
}

export const Svg = ({
  appearance,
  size,
  children,
  isLoading,
  ...otherProps
}: SvgProps) => (
  <Theme.Consumer appearance={appearance} isLoading={isLoading} size={size}>
    {({ backgroundColor, borderRadius }) => {
      return (
        <svg
          style={{
            backgroundColor,
            borderRadius,
            height: '100%',
            width: '100%',
          }}
          {...otherProps}
        >
          {children}
        </svg>
      );
    }}
  </Theme.Consumer>
);