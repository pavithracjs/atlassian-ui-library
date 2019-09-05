import { AvatarItem } from '@atlaskit/avatar';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

const AvatarComponent = styled.div`
  &,
  &:hover,
  &:active,
  &:focus {
    padding: 0;
    margin: 0;
    border: none;
  }
`;

export const TextWrapper = styled.span`
  color: ${({ color }) => color};
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
`;

export type AvatarItemOptionProps = {
  avatar: ReactNode;
  primaryText?: ReactNode;
  secondaryText?: ReactNode;
};

export const AvatarItemOption = (props: AvatarItemOptionProps) => (
  <AvatarItem
    backgroundColor="transparent"
    component={AvatarComponent}
    {...props}
  />
);
