import React from 'react';

import { Create } from '../../src';

const onClick = (...args: any[]) => {
  console.log('create click', ...args);
};

export const DefaultCreate = () => <Create onClick={onClick} text="Create" />;
