// @noflow

import React from 'react';
import RefinementBar, { AsyncSelectFilter } from '../src';
import { CAPITALS } from './data';

function filterCapitals(inputValue) {
  return CAPITALS.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
}

const CONFIG = {
  capital: {
    label: 'Capitals',
    type: AsyncSelectFilter,
    loadOptions: inputValue =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(filterCapitals(inputValue));
        }, 1000);
      }),
    defaultOptionsLabel: 'Popular',
    defaultOptions: CAPITALS.filter(opt =>
      ['Melbourne', 'Sydney'].includes(opt.label),
    ),
  },
};

export default function AsyncSelectFilterConfigReference() {
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
