import React from 'react';
import { Reset, ResetTheme } from '../src';

export default () => (
  <ResetTheme.Provider
    value={t => ({ ...t({}), backgroundColor: '#333', textColor: '#eee' })}
  >
    <Reset>
      <div style={{ padding: 10 }}>You can also theme a reset.</div>
    </Reset>
  </ResetTheme.Provider>
);
