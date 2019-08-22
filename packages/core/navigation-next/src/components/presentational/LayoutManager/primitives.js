// @flow

import React, { type ElementRef } from 'react';
import { layers } from '@atlaskit/theme/constants';

export const LayoutContainer = ({ topOffset = 0, ...props }: *) => {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: 'row',
        height: `calc(100vh - ${topOffset}px)`,
        marginTop: `${topOffset}px`,
      }}
      {...props}
    />
  );
};

export const NavigationContainer = ({ topOffset, innerRef, ...props }: *) => (
  <div
    ref={innerRef}
    css={{
      bottom: 0,
      display: 'flex',
      flexDirection: 'row',
      left: 0,
      position: 'fixed',
      top: topOffset,
      zIndex: layers.navigation(),
      height: `calc(100vh - ${topOffset}px)`,
    }}
    {...props}
  />
);

// Resizable Elements can be disabled

export type Resizable = {
  innerRef?: ElementRef<*>,
  disableInteraction: boolean,
};
