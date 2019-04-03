import { Skeleton } from '@atlaskit/icon';
import InviteTeamIcon from '@atlaskit/icon/glyph/invite-team';
import * as React from 'react';
import styled from 'styled-components';

const AddOptionAvatarWrapper = styled.span`
  color: black;
  padding: 2px;
`;

// This is a workaround for using Skeleton
// as Skeleton is preset with opacity, and altering the fill-color in hover state
const WhiteBackgroundWrapper = styled.div`
  background-color: white;
  border-radius: 50%;
`;

export type AddOptionAvatarProps = {
  label: string;
  size?: 'small' | 'large';
};

export const AddOptionAvatar: React.StatelessComponent<
  AddOptionAvatarProps
> = ({ size, label }) => (
  <AddOptionAvatarWrapper>
    <WhiteBackgroundWrapper>
      <Skeleton size={size}>
        <InviteTeamIcon label={label} size={size} primaryColor="white" />
      </Skeleton>
    </WhiteBackgroundWrapper>
  </AddOptionAvatarWrapper>
);

AddOptionAvatar.defaultProps = {
  size: 'large',
};
