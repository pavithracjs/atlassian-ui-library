import React from 'react';
import styled from 'styled-components';
import { borderRadius, colors } from '@atlaskit/theme';

type IconProps = { label: string; primaryColor: string };

type HeaderIconProps = {
  icon: React.ComponentType<IconProps>;
  color: string;
  label: string;
};

const IconWrapper = styled.div`
  align-items: center;
  background-color: ${p => p.color};
  border-radius: ${borderRadius}px;
  display: flex;
  height: 40px;
  justify-content: center;
  width: 40px;
`;

export default ({ icon: Icon, color, label }: HeaderIconProps) => (
  <IconWrapper color={color}>
    <Icon label={label} primaryColor={colors.N0} />
  </IconWrapper>
);
