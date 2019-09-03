/** @jsx jsx */
import Button from '@atlaskit/button';
import Tooltip from '@atlaskit/tooltip';
import { jsx } from '@emotion/core';
import { chevronStyles, getPrimaryButtonTheme } from './styles';
import { PrimaryButtonProps } from './types';
import { TriggerManager } from '../TriggerManager';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import { withAppNavigationTheme } from '../../theme';

export const PrimaryButton = (props: PrimaryButtonProps) => {
  const {
    component,
    dropdownContent,
    href,
    isSelected,
    target,
    testId,
    text,
    theme,
    tooltip,
    ...triggerManagerProps
  } = props;

  return (
    <Tooltip content={tooltip}>
      <TriggerManager
        position="top left"
        dropdownContent={dropdownContent}
        {...triggerManagerProps}
      >
        {({ onTriggerClick }) => (
          <Button
            appearance="primary"
            component={component}
            data-test-id={testId}
            href={href}
            iconAfter={
              dropdownContent ? (
                <span className="chevron" css={chevronStyles}>
                  <ChevronDownIcon label="" />
                </span>
              ) : (
                undefined
              )
            }
            isSelected={isSelected}
            onClick={onTriggerClick}
            target={target}
            theme={getPrimaryButtonTheme(theme)}
          >
            {text}
          </Button>
        )}
      </TriggerManager>
    </Tooltip>
  );
};

PrimaryButton.defaultProps = {
  isSelected: false,
  testId: 'NavigationItem',
};

export const ThemedPrimaryButton = withAppNavigationTheme(PrimaryButton);
