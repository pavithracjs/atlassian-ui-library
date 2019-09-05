/** @jsx jsx */
import SignInIcon from '@atlaskit/icon/glyph/sign-in';
import { jsx } from '@emotion/core';

import { ThemedIconButton } from '../IconButton';
import { TriggerManager } from '../TriggerManager';
import { ProfileProps } from './types';

export const Profile = (props: ProfileProps) => {
  const { avatar, tooltip, ...triggerManagerProps } = props;
  if (!avatar) {
    return (
      <ThemedIconButton
        icon={<SignInIcon label={tooltip} />}
        tooltip={tooltip}
      />
    );
  }

  return (
    <TriggerManager {...triggerManagerProps}>
      {({ onTriggerClick }) => (
        <ThemedIconButton
          icon={avatar}
          onClick={onTriggerClick}
          tooltip={tooltip}
        />
      )}
    </TriggerManager>
  );
};
