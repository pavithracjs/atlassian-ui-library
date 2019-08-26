// @flow

import React, { type Node } from 'react';
import styled from 'styled-components';
import { themed, withTheme } from '@atlaskit/theme/components';
import { N50, DN100, background } from '@atlaskit/theme/colors';
import { Theme } from '../theme';
import type { AppearanceType, SizeType } from '../types';

export const ShapeGroup = withTheme(styled.g`
  & circle,
  & rect {
    fill: ${themed({ light: N50, dark: DN100 })};
  }
  & g {
    fill: ${background};
  }
`);

type SlotProps = {|
  appearance: AppearanceType,
  isLoading: boolean,
  size: SizeType,
  role: string,
  label: ?string,
  backgroundImage: ?string,
|};

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
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : null,
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

type SvgProps = {
  appearance: AppearanceType,
  isLoading: boolean,
  size: SizeType,
  children: Node,
};

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
