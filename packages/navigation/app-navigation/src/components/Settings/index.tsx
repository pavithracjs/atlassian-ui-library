import React from 'react';
import SettingsIcon from '@atlaskit/icon/glyph/settings';

import { ThemedIconButton } from '../IconButton';
import { TriggerManager } from '../TriggerManager';
import { SettingsProps } from './types';

export const Settings = (props: SettingsProps) => {
  const { tooltip, ...triggerManagerProps } = props;

  return (
    <TriggerManager {...triggerManagerProps}>
      {({ onTriggerClick }) => (
        <ThemedIconButton
          icon={<SettingsIcon label={tooltip} />}
          onClick={onTriggerClick}
          tooltip={tooltip}
        />
      )}
    </TriggerManager>
  );
};
