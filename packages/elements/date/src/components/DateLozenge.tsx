import * as React from 'react';
import { borderRadius, colors, themed } from '@atlaskit/theme';
import styled from 'styled-components';

export type Color = 'grey' | 'red' | 'blue' | 'green' | 'purple' | 'yellow';

export type Props = React.HTMLProps<HTMLSpanElement> & {
  clickable?: boolean;
  color?: Color;
};

export const resolveColors = (props: Props): [string, string, string] => {
  const { color } = props;
  if (!color || color === 'grey') {
    const background = themed({ light: colors.N30A, dark: colors.DN70 });
    const color = themed({ light: colors.N800, dark: colors.DN800 });
    const hoverBackground = themed({ light: colors.N40, dark: colors.DN60 });
    return [background(props), color(props), hoverBackground(props)];
  }

  const letter = color.toUpperCase().charAt(0);
  return [colors[`${letter}50`], colors[`${letter}500`], colors[`${letter}75`]];
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
    const [background, color, hoverBackground] = resolveColors(props);
    return `
      background: ${background};
      color: ${color};
      &:hover {
        background: ${hoverBackground};
      }
    `;
  }};
` as React.ComponentType<Props>;
