import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import React from 'react';

import { withAppNavigationTheme } from '../../theme';
import { ThemedIconButton } from '../IconButton';
import { TriggerManager } from '../TriggerManager';
import { HelpProps } from './types';

export const Help = (props: HelpProps) => {
  const {
    theme: {
      mode: { navigation },
    },
    tooltip,
    ...triggerManagerProps
  } = props;

  return (
    <TriggerManager {...triggerManagerProps}>
      {({ onTriggerClick }) => (
        <ThemedIconButton
          icon={
            <QuestionCircleIcon
              label={tooltip}
              secondaryColor={navigation.backgroundColor}
            />
          }
          onClick={onTriggerClick}
          tooltip={tooltip}
        />
      )}
    </TriggerManager>
  );
};

export const ThemedHelp = withAppNavigationTheme(Help);
