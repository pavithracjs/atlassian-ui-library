// @noflow

import React from 'react';
import RefinementBar, { AvatarAsyncSelectFilter } from '../src';
import { USERS } from './data';

function filterAssignees(inputValue) {
  return USERS.filter(i =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
}

const CONFIG = {
  assignee: {
    label: 'Assignee',
    type: AvatarAsyncSelectFilter,
    loadOptions: inputValue =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(filterAssignees(inputValue));
        }, 1000);
      }),
    defaultOptionsLabel: 'Recommended',
    defaultOptions: [
      {
        value: '__current-user',
        label: 'Current User',
        avatar: `http://i.pravatar.cc/48?u=__current-user`,
      },
      {
        value: '__unassigned',
        label: 'Unassigned',
        avatar: null,
      },
    ],
  },
};

export default function AvatarAsyncSelectFilterConfigReference() {
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
