// @noflow

import React from 'react';
import RefinementBar, { IssueAsyncSelectFilter } from '../src';
import { ISSUE_TYPES } from './data';

function filterTypes(inputValue) {
  return ISSUE_TYPES.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
}

const CONFIG = {
  issueType: {
    label: 'Type',
    type: IssueAsyncSelectFilter,
    loadOptions: inputValue =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(filterTypes(inputValue));
        }, 1000);
      }),
    defaultOptionsLabel: 'Recommended',
    defaultOptions: [
      { value: '__all-standard', label: 'All standard issue types' },
      { value: '__all-sub-task', label: 'All sub-task issue types' },
    ],
  },
};

export default function IssueAsyncSelectFilterConfigReference() {
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
