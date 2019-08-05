// @noflow

import React from 'react';
import RefinementBar, { SelectFilter } from '../src';

const CAPITALS = [
  { label: 'Adelaide', value: 'adelaide' },
  { label: 'Brisbane', value: 'brisbane' },
  { label: 'Canberra', value: 'canberra' },
  { label: 'Darwin', value: 'darwin' },
  { label: 'Hobart', value: 'hobart' },
  { label: 'Melbourne', value: 'melbourne' },
  { label: 'Perth', value: 'perth' },
  { label: 'Sydney', value: 'sydney' },
];

const CONFIG = {
  capitals: {
    label: 'Capitals',
    type: SelectFilter,
    options: CAPITALS,
  },
  filteredCapitals: {
    label: 'Filtered Capitals',
    type: SelectFilter,
    options: refBarVal => {
      return CAPITALS.reduce((acc, opt) => {
        if (!refBarVal.capitals || !refBarVal.capitals.includes(opt)) {
          acc.push(opt);
        }
        return acc;
      }, []);
    },
  },
};

export default function SelectFilterConfigReference() {
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
