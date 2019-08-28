import React from 'react';

import { Search } from '../../src';

const drawerContent = () => <div>search</div>;

const onClick = (...args: any[]) => {
  console.log('search click', ...args);
};

const onDrawerClose = (...args: any[]) => {
  console.log('search close', ...args);
};

const onDrawerCloseComplete = (...args: any[]) => {
  console.log('search close complete', ...args);
};

export const DefaultSearch = () => (
  <Search
    drawerContent={drawerContent}
    onClick={onClick}
    onClose={onDrawerClose}
    onDrawerCloseComplete={onDrawerCloseComplete}
    text="Search..."
    tooltip="Search"
  />
);
