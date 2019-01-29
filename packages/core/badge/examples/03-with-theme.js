// @flow
import React from 'react';
import Badge from '../src';

export default () => (
  <div>
    <Badge
      theme={defaultTheme => ({
        ...defaultTheme,
        backgroundColor: 'red',
        textColor: 'yellow',
      })}
      appearance="removed"
    >
      {1}
    </Badge>
  </div>
);
