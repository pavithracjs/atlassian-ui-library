import * as React from 'react';
import { ReactElement, MouseEvent } from 'react';

import Tooltip from '@atlaskit/tooltip';
import UiButton from '@atlaskit/button';
import { colors, themed } from '@atlaskit/theme';

import styled from 'styled-components';
import { hexToRgba } from '@atlaskit/editor-common';

const editorButtonTheme = {
  background: {
    danger: {
      default: themed({ light: 'inherit', dark: 'inherit' }),
      hover: themed({ light: colors.N30A, dark: colors.N30A }),
      active: themed({
        light: hexToRgba(colors.B75, 0.6),
        dark: hexToRgba(colors.B75, 0.6),
      }),
    },
  },
  color: {
    danger: {
      hover: themed({ light: colors.R300, dark: colors.R300 }),
      active: themed({ light: colors.R300, dark: colors.R300 }),
    },
  },
};

const Button = styled(UiButton)`
  padding: 0 2px;

  &[href] {
    padding: 0 2px;
  }
`;

const getStyle = (styles, appearance, state) => {
  if (!styles[appearance] || !styles[appearance][state]) return 'initial';
  return styles[appearance][state];
};

export type ButtonAppearance = 'subtle' | 'danger';
export interface Props {
  title?: string;
  icon?: ReactElement<any>;
  iconAfter?: ReactElement<any>;
  onClick: React.MouseEventHandler;
  onMouseEnter?: <T>(event: MouseEvent<T>) => void;
  onMouseLeave?: <T>(event: MouseEvent<T>) => void;
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
          theme={(adgTheme, { appearance = 'default', state = 'default' }) => {
            const { buttonStyles: adgButtonStyles } = adgTheme({
              appearance,
              state,
            });

            return {
              buttonStyles: {
                ...adgButtonStyles,
                ...{
                  background: getStyle(
                    editorButtonTheme.background,
                    appearance,
                    state,
                  ),
                  color: getStyle(editorButtonTheme.color, appearance, state),
                },
              },
              iconStyles: {},
              spinnerStyles: {},
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
