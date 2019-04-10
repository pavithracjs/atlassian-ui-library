// @flow
/** @jsx jsx */

// $FlowFixMe
import { forwardRef, type Node } from 'react';
import { jsx } from '@emotion/core';
import { borderRadius, colors, gridSize } from '@atlaskit/theme';
import Tooltip from '@atlaskit/tooltip';

import { ClearButton } from './common';

type Props = {
  children: Node,
  field: Object,
  isInvalid: boolean,
  isSelected: boolean,
  onClick: (*) => void,
  onClear: (*) => void,
};

export const FilterButton = forwardRef(
  (
    { children, field, isInvalid, isSelected, onClick, onClear }: Props,
    ref,
  ) => {
    return onClear ? (
      <ButtonWrapper>
        <Button
          appearance={isInvalid ? 'warning' : 'default'}
          isSelected={isSelected}
          onClick={onClick}
          ref={ref}
          hasIcon
        >
          {children}
        </Button>

        <Tooltip content="Clear filter" position="top">
          <ClearButton
            isSelected={isSelected && !isInvalid}
            onClick={onClear}
            label={`Clear ${field.label} filter`}
          />
        </Tooltip>
      </ButtonWrapper>
    ) : (
      <Button isSelected={isSelected} onClick={onClick} ref={ref}>
        {children}
      </Button>
    );
  },
);

// ==============================
// Styled Components
// ==============================

const appearances = ({ appearance, isSelected }) => {
  const styles = {
    default: {
      base: {
        background: isSelected ? colors.N700 : colors.N20A,
        color: isSelected ? 'white' : colors.N400,
      },
      active: {
        background: isSelected ? colors.N700 : colors.B50,
        color: isSelected ? 'white' : colors.B400,
      },
      hover: {
        background: isSelected ? colors.N700 : colors.N30A,
        color: isSelected ? 'white' : colors.N400,
      },
    },
    warning: {
      base: {
        background: colors.Y100,
      },
      active: {
        background: colors.Y200,
      },
      hover: {
        background: colors.Y200,
      },
    },
  };

  return styles[appearance];
};

// eslint-disable-next-line react/no-multi-comp
const Button = forwardRef(
  ({ appearance, hasIcon, isSelected, ...props }: *, ref) => {
    const dynamic = appearances({ appearance, isSelected });

    return (
      <button
        ref={ref}
        css={{
          // alignItems: 'baseline',
          borderRadius: borderRadius(),
          borderWidth: 0,
          boxSizing: 'border-box',
          cursor: 'pointer',
          display: 'inline-flex',
          fontSize: 'inherit',
          fontStyle: 'normal',
          lineHeight: 1.3,
          margin: 0,
          maxWidth: '100%',
          outline: 0,
          padding: `${gridSize()}px ${gridSize() * 1.5}px`,
          paddingRight: hasIcon ? 36 : null,
          textAlign: 'center',
          textDecoration: 'none',
          transition:
            'background 0.1s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
          transitionDuration: '0.1s, 0.15s',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
          ...dynamic.base,

          '&:hover': {
            transition:
              'background 0s ease-out, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38)',
            ...dynamic.hover,
          },

          '&:focus': {
            boxShadow: '0 0 0 2px rgba(38,132,255,0.6)',
            transitionDuration: '0s, 0.2s',

            '&::-moz-focus-inner': {
              border: 0,
              margin: 0,
              padding: 0,
            },
          },

          '&:active': {
            transitionDuration: 0,
            ...dynamic.active,
          },
        }}
        {...props}
      />
    );
  },
);
Button.defaultProps = {
  appearance: 'default',
};
const ButtonWrapper = props => (
  <div css={{ position: 'relative' }} {...props} />
);
