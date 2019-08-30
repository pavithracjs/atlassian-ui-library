/** @jsx jsx */
import { jsx } from '@emotion/core';
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';

import { iconButtonTheme } from './styles';
import { IconButtonProps } from './types';

export const IconButton = ({
  className = '',
  icon,
  onClick,
  testId = 'NavigationItem',
  theme = iconButtonTheme,
  tooltip,
}: IconButtonProps) => (
  <Tooltip content={tooltip}>
    <Button
      appearance="primary"
      data-test-id={testId}
      className={className}
      iconBefore={icon}
      onClick={onClick}
      theme={theme}
    />
  </Tooltip>
);
