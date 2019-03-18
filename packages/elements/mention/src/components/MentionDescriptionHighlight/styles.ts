import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { colors } from '@atlaskit/theme';

export const DescriptionHighlightStyle: ComponentClass<
  HTMLAttributes<{}>
> = styled.span`
  color: ${colors.N100};
  font-size: 12px;

  margin-top: 2px;

  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
