// @noflow
/** @jsx jsx */

import { forwardRef } from 'react';
import { jsx } from '@emotion/core';

// Styled Components
// ------------------------------

export const Heading = forwardRef(({ children, ...props }, ref) => (
  <h4 ref={ref} css={{ margin: '1em 0 0' }} {...props}>
    {children}
  </h4>
));
export const Hr = props => (
  <hr
    css={{
      backgroundColor: '#DFE1E6',
      border: 0,
      height: 1,
      marginBottom: '1em',
      marginTop: '1em',
    }}
    {...props}
  />
);

export const Pre = forwardRef((props, ref) => (
  <pre
    ref={ref}
    css={{
      backgroundColor: '#F4F5F7',
      borderRadius: 4,
      boxSizing: 'border-box',
      color: '#505F79',
      flex: 1,
      fontSize: '0.85rem',
      lineHeight: 1.6,
      maxWidth: '100%',
      overflow: 'auto',
      padding: 16,
    }}
    {...props}
  />
));

export const PreMap = forwardRef(({ value }: *, ref) => (
  <Pre ref={ref}>{Object.entries(value).map(dataMap)}</Pre>
));

// Helpers
// ------------------------------

export const dataMap = ([key, val]) => (
  <div key={key}>
    <code>
      {key}: {JSON.stringify(val, null, 2)}
    </code>
  </div>
);
