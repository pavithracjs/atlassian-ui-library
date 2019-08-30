import React from 'react';
import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

import { IconButton } from '../IconButton';
import { TriggerManager } from '../TriggerManager';
import { AppSwitcherProps } from './types';

export const AppSwitcher = (props: AppSwitcherProps) => {
  const { tooltip, ...triggerManagerProps } = props;

  return (
    <TriggerManager {...triggerManagerProps}>
      {({ onTriggerClick }) => (
        <IconButton
          icon={<AppSwitcherIcon label={tooltip} />}
          onClick={onTriggerClick}
          tooltip={tooltip}
        />
      )}
    </TriggerManager>
  );
};
