// @noflow

import React from 'react';
import RefinementBar, { NumberFilter } from '../src';

const CONFIG = {
  votes: {
    label: 'Votes',
    type: NumberFilter,
  },
};

export default function NumberFilterConfigReference() {
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
