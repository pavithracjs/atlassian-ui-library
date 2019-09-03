import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { B300 } from '@atlaskit/theme/colors';
import React from 'react';
import { IconButton } from '../IconButton';
import { HelpProps } from './types';
import { TriggerManager } from '../TriggerManager';

export const Help = (props: HelpProps) => {
  const { tooltip, ...triggerManagerProps } = props;

  return (
    <TriggerManager {...triggerManagerProps}>
      {({ onTriggerClick }) => (
        <IconButton
          icon={<QuestionCircleIcon label={tooltip} secondaryColor={B300} />}
          onClick={onTriggerClick}
          tooltip={tooltip}
        />
      )}
    </TriggerManager>
  );
};
