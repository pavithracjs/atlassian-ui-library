// @flow

import React from 'react';
import { N20 } from '@atlaskit/theme/colors';
import { Group, Item } from '../../../src';

import { CONTENT_NAV_WIDTH } from '../../../src/common/constants';

export default () => (
  <div
    css={{
      backgroundColor: N20,
      boxSizing: 'border-box',
      padding: '8px',
      width: `${CONTENT_NAV_WIDTH}px`,
    }}
  >
    <Group heading="Group heading" hasSeparator>
      <Item text="Item" />
      <Item text="Item" />
      <Item text="Item" />
    </Group>
  </div>
);
