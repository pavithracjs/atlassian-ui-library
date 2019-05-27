import * as React from 'react';
import color from 'color';
import { colors } from '../src';

export default () => (
  <>
    {Object.keys(colors as Record<string, any>)
      // @ts-ignore colors has no index signature
      .filter(c => typeof colors[c] === 'string')
      .map(c => (
        <span
          key={c}
          style={{
            // @ts-ignore colors has no index signature
            backgroundColor: `${colors[c]}`,
            borderRadius: 3,
            // @ts-ignore colors has no index signature
            color: `${color(colors[c]).negate()}`,
            display: 'inline-block',
            marginBottom: 10,
            marginRight: 10,
            padding: 10,
          }}
        >
          {c}
        </span>
      ))}
  </>
);
