import React, { Fragment } from 'react';

import { themes } from './shared/themes';
import { AppNavigationSkeleton } from '../src';

const primary = 4;
const secondary = 4;

const ThemedSkeletonExample = () => (
  <div>
    {themes.map((theme, i) => (
      <Fragment key={i}>
        <AppNavigationSkeleton
          primaryItemsCount={primary}
          secondaryItemsCount={secondary}
          theme={theme}
        />
        {i < themes.length - 1 && <br />}
      </Fragment>
    ))}
  </div>
);

export default ThemedSkeletonExample;
