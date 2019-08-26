/** @jsx jsx */

import { Component, FC, ReactChildren, MouseEvent } from 'react';
import { layers, gridSize } from '@atlaskit/theme/constants';
import { N0, N500, N30A, B50 } from '@atlaskit/theme/colors';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';
import { jsx } from '@emotion/core';

import { Slide } from './transitions';
import { DrawerPrimitiveProps, DrawerWidth, Widths } from './types';

// Misc.
// ------------------------------

const widths: Widths = {
  full: '100vw',
  extended: '95vw',
  narrow: 45 * gridSize(),
  medium: 60 * gridSize(),
  wide: 75 * gridSize(),
};

// Wrapper
// ------------------------------

const Wrapper = ({
  width = 'narrow',
  shouldUnmountOnExit,
  ...props
}: {
  children?: ReactChildren;
  shouldUnmountOnExit?: boolean;
  width: DrawerWidth;
}) => {
  return (
    <div
      css={{
        backgroundColor: N0,
        display: 'flex',
        height: '100vh',
        left: 0,
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        width: widths[width],
        zIndex: layers.blanket() + 1,
      }}
      {...props}
    />
  );
};

// Content
// ------------------------------

const Content: FC = props => (
  <div
    css={{ flex: 1, marginTop: 3 * gridSize(), overflow: 'auto' }}
    {...props}
  />
);

// Sidebar / Icons etc.
// ------------------------------

const Sidebar: FC = props => {
  return (
    <div
      css={{
        alignItems: 'center',
        boxSizing: 'border-box',
        color: N500,
        display: 'flex',
        flexShrink: 0,
        flexDirection: 'column',
        height: '100vh',
        paddingBottom: 2 * gridSize(),
        paddingTop: 3 * gridSize(),
        width: 8 * gridSize(),
      }}
      {...props}
    />
  );
};

interface IconWrapperProps {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}
const IconWrapper: FC<IconWrapperProps> = props => (
  <button
    type="button"
    css={{
      alignItems: 'center',
      background: 0,
      border: 0,
      borderRadius: '50%',
      color: 'inherit',
      cursor: props.onClick ? 'pointer' : undefined,
      display: 'flex',
      fontSize: 'inherit',
      height: 5 * gridSize(),
      justifyContent: 'center',
      lineHeight: 1,
      marginBottom: 2 * gridSize(),
      padding: 0,
      width: 5 * gridSize(),

      '&:hover': {
        backgroundColor: props.onClick ? N30A : undefined,
      },
      '&:active': {
        backgroundColor: props.onClick ? B50 : undefined,
        outline: 0,
      },
    }}
    {...props}
  />
);

export default class DrawerPrimitive extends Component<DrawerPrimitiveProps> {
  render() {
    const {
      children,
      icon: Icon,
      onClose,
      onCloseComplete,
      ...props
    } = this.props;

    return (
      <Slide component={Wrapper} onExited={onCloseComplete} {...props}>
        <Sidebar>
          <IconWrapper
            onClick={onClose}
            data-test-selector="DrawerPrimitiveSidebarCloseButton"
          >
            {Icon ? <Icon size="large" /> : <ArrowLeft label="Close drawer" />}
          </IconWrapper>
        </Sidebar>
        <Content>{children}</Content>
      </Slide>
    );
  }
}
