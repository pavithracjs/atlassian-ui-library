// @flow
import styled from 'styled-components';
import { withTheme } from '@atlaskit/theme/components';
import { background } from '@atlaskit/theme/colors';
import { BORDER_WIDTH } from './constants';

// set fallbacks for border color/width to protect consumers from invalid values
export const Outer = withTheme(styled.span`
  align-content: center;
  align-items: center;
  background-color: ${props => props.bgColor || background};
  border-radius: 50%;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  overflow: hidden;
  padding: ${({ size }) => BORDER_WIDTH[size] || BORDER_WIDTH.medium}px;
  width: 100%;
`);

export const Inner = styled.span`
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 100%;
  overflow: hidden;
  width: 100%;
`;
