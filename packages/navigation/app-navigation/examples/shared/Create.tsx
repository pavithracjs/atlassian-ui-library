import React from 'react';

import { ThemedCreate } from '../../src';

const onClick = (...args: any[]) => {
  console.log('create click', ...args);
};

export const DefaultCreate = () => (
  <ThemedCreate onClick={onClick} text="Create" />
);
