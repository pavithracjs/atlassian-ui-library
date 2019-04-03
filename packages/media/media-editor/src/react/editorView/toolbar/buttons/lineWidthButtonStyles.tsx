// tslint:disable:variable-name

import styled from 'styled-components';

import { HTMLAttributes, ComponentClass } from 'react';
import { colors } from '@atlaskit/theme';

export interface AreaProps {
  isActive: boolean;
}

export const TOTAL_CIRCLE_SIZE = 18;

export const MainArea: ComponentClass<
  HTMLAttributes<{}> & AreaProps
> = styled.div`
  box-sizing: border-box;
  width: ${TOTAL_CIRCLE_SIZE}px;
  height: ${TOTAL_CIRCLE_SIZE}px;
  border-radius: 15px;
  background-color: ${(props: AreaProps) =>
    props.isActive ? colors.N500 : colors.N30};
`;

export const FrontArea: ComponentClass<
  HTMLAttributes<{}> & AreaProps
> = styled.div`
  box-sizing: border-box;
  background-color: ${(props: AreaProps) =>
    props.isActive ? colors.N0 : colors.N500};
`;
