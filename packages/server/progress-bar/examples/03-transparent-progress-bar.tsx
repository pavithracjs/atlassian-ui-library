import * as React from 'react';
import { TransparentProgressBar } from '../src';
import { containerStyle, progress } from './00-basic';

const gradientBackground = {
  padding: '15px 10px',
  background: 'linear-gradient(to right, #283E51, #4B79A1)',
  borderRadius: 3,
};

export default () => (
  <div style={containerStyle}>
    <div style={gradientBackground}>
      <TransparentProgressBar value={progress} />
    </div>
  </div>
);
