// @noflow

import React from 'react';
import RefinementBar, { LozengeAsyncSelectFilter } from '../src';

const FIELD_CONFIG = {
  capitals: {
    label: 'Capitals',
    type: LozengeAsyncSelectFilter,
    cacheOptions: true,
    defaultOptions: true,
    loadOptions: (inputValue: string) =>
      new Promise(resolve => {
        setTimeout(
          () =>
            resolve(
              [
                { label: 'Adelaide', value: 'adelaide' },
                {
                  label: 'Brisbane',
                  value: 'brisbane',
                  appearance: 'inprogress',
                },
                { label: 'Canberra', value: 'canberra' },
                { label: 'Darwin', value: 'darwin', appearance: 'moved' },
                { label: 'Hobart', value: 'hobart', isBold: true },
                { label: 'Melbourne', value: 'melbourne', appearance: 'new' },
                { label: 'Perth', value: 'perth', appearance: 'removed' },
                { label: 'Sydney', value: 'sydney', appearance: 'success' },
                {
                  label:
                    'Krung Thep Mahanakhon Amon Rattanakosin Mahinthara Yuthaya Mahadilok Phop Noppharat Ratchathani Burirom Udomratchaniwet Mahasathan Amon Piman Awatan Sathit Sakkathattiya Witsanukam Prasit',
                  value: 'bangkok',
                  maxWidth: 300,
                },
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
