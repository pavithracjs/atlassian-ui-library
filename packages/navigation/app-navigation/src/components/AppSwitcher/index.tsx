import React from 'react';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

import { ThemedIconButton } from '../IconButton';
import { TriggerManager } from '../TriggerManager';
import { AppSwitcherProps } from './types';

export const AppSwitcher = (props: AppSwitcherProps) => {
  const { tooltip, ...triggerManagerProps } = props;

  return (
    <TriggerManager {...triggerManagerProps}>
      {({ onTriggerClick }) => (
        <ThemedIconButton
          icon={<AppSwitcherIcon label={tooltip} />}
          onClick={onTriggerClick}
          tooltip={tooltip}
        />
      )}
    </TriggerManager>
  );
};
