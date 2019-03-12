import * as React from 'react';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button';
import { getButtonStyles } from './styles';

export type ButtonAppearance = 'subtle' | 'danger';
export interface Props {
  title?: string;
  icon?: React.ReactElement<any>;
  iconAfter?: React.ReactElement<any>;
  onClick: React.MouseEventHandler;
  onMouseEnter?: <T>(event: React.MouseEvent<T>) => void;
  onMouseLeave?: <T>(event: React.MouseEvent<T>) => void;
  selected?: boolean;
  disabled?: boolean;
  appearance?: ButtonAppearance;
  href?: string;
  target?: string;
  children?: React.ReactNode;
}

export default ({
  title,
  icon,
  iconAfter,
  onClick,
  onMouseEnter,
  onMouseLeave,
  selected,
  disabled,
  href,
  target,
  appearance = 'subtle',
  children,
}: Props) => {
  return (
    <Tooltip content={title} hideTooltipOnClick={true} position="top">
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Button
          theme={(adgTheme, themeProps) => {
            const { buttonStyles, ...rest } = adgTheme(themeProps);
            return {
              buttonStyles: {
                ...buttonStyles,
                // Is there a better way to do this? We don't
                // want to list all the appearances...
                ...(appearance === 'danger' &&
                  getButtonStyles({
                    appearance,
                    state: themeProps.state,
                    mode: themeProps.mode,
                  })),
              },
              ...rest,
            };
          }}
          aria-label={title}
          spacing="compact"
          href={href}
          target={target}
          appearance={appearance}
          aria-haspopup={true}
          iconBefore={icon}
          iconAfter={iconAfter}
          onClick={onClick}
          isSelected={selected}
          isDisabled={disabled}
        >
          {children}
        </Button>
      </div>
    </Tooltip>
  );
};
