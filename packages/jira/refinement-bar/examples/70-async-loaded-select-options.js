// @noflow

import React from 'react';
import RefinementBar, { AsyncSelectFilter } from '../src';

const FIELD_CONFIG = {
  capitals: {
    label: 'Capitals',
    type: AsyncSelectFilter,
    cacheOptions: true,
    defaultOptions: true,
    loadOptions: (inputValue: string) =>
      new Promise(resolve => {
        setTimeout(
          () =>
            resolve(
              [
                { label: 'Adelaide', value: 'adelaide' },
                { label: 'Brisbane', value: 'brisbane' },
                { label: 'Canberra', value: 'canberra' },
                { label: 'Darwin', value: 'darwin' },
                { label: 'Hobart', value: 'hobart' },
                { label: 'Melbourne', value: 'melbourne' },
                { label: 'Perth', value: 'perth' },
                { label: 'Sydney', value: 'sydney' },
              ].filter(e => e.label.match(new RegExp(inputValue, 'i'))),
            ),
          inputValue ? 0 : 3000,
        );
      }),
  },
};

const IRREMOVABLE_KEYS = Object.keys(FIELD_CONFIG);
const noop = () => {};
const defaultValue = {};

const AsyncLoadedSelectOptions = () => (
  <div style={{ padding: 20 }}>
    <RefinementBar
      fieldConfig={FIELD_CONFIG}
      irremovableKeys={IRREMOVABLE_KEYS}
      onChange={noop}
      value={defaultValue}
    />
  </div>
);

export default AsyncLoadedSelectOptions;
