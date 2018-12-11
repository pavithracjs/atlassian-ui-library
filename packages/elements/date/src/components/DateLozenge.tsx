import * as React from 'react';
import { borderRadius, colors, themed } from '@atlaskit/theme';
import styled from 'styled-components';

export type Color = 'grey' | 'red' | 'blue' | 'green' | 'purple' | 'yellow';

export type Props = React.HTMLProps<HTMLSpanElement> & {
  clickable?: boolean;
  color?: Color;
};

export const resolveColors = (
  color?: Color,
): { light: [string, string, string]; dark: [string, string, string] } => {
  if (!color || color === 'grey') {
    return {
      light: [colors.N30A, colors.N800, colors.N40],
      dark: [colors.DN70, colors.DN800, colors.DN60],
    };
  }
  const letter = color.toUpperCase().charAt(0);
  return {
    light: [
      colors[`${letter}50`],
      colors[`${letter}500`],
      colors[`${letter}75`],
    ],
    dark: [
      colors[`${letter}50`],
      colors[`${letter}500`],
      colors[`${letter}75`],
    ],
  };
};

/**
 * TODO when update typescript to 2.9+
 * add custom props as Generic Parameter to span instead of casting
 */
export const DateLozenge = styled.span`
  border-radius: ${borderRadius()}px;
  padding: 2px 4px;
  margin: 0 1px;
  position: relative;
  transition: background 0.3s;
  white-space: nowrap;
  cursor: ${(props: Props) => (props.onClick ? 'pointer' : 'unset')};

  ${(props: Props) => {
    const { light, dark } = resolveColors(props.color);
    return `
      background: ${themed({ light: light[0], dark: dark[0] })(props)};
      color: ${themed({ light: light[1], dark: dark[1] })(props)};
      &:hover {
        background: ${themed({ light: light[2], dark: dark[2] })(props)};
      }
    `;
  }};
` as React.ComponentType<Props>;
