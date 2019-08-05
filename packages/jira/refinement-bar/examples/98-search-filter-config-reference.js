// @noflow

import React from 'react';
import RefinementBar, { SearchFilter } from '../src';

const CONFIG = {
  search: {
    label: 'Search',
    type: SearchFilter,
  },
};

export default function SearchFilterConfigReference() {
  const [value, setValue] = React.useState({});

  return (
    <RefinementBar
      fieldConfig={CONFIG}
      irremovableKeys={Object.keys(CONFIG)}
      onChange={v => setValue(v)}
      value={value}
    />
  );
}
