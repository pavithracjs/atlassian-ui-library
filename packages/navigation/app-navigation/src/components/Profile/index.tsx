/** @jsx jsx */
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import { jsx } from '@emotion/core';

import { IconButton } from '../IconButton';
import { TriggerManager } from '../TriggerManager';
import { profileButtonTheme } from './styles';
import { ProfileProps } from './types';

export const Profile = (props: ProfileProps) => {
  const { avatar, tooltip, ...triggerManagerProps } = props;
  if (!avatar) {
    return (
      <IconButton icon={<SignInIcon label={tooltip} />} tooltip={tooltip} />
    );
  }

  return (
    <TriggerManager {...triggerManagerProps}>
      {({ onTriggerClick }) => (
        <IconButton
          icon={avatar}
          onClick={onTriggerClick}
          theme={profileButtonTheme}
          tooltip={tooltip}
        />
      )}
    </TriggerManager>
  );
};
