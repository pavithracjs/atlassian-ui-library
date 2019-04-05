// @flow

import React from 'react';
import { N20 } from '@atlaskit/theme/colors';
import { SkeletonContainerView } from '../../../src';

export default () => (
  <div
    css={{
      backgroundColor: N20,
      boxSizing: 'border-box',
      paddingBottom: '48px',
      width: '240px ',
    }}
  >
    <SkeletonContainerView />
  </div>
);
