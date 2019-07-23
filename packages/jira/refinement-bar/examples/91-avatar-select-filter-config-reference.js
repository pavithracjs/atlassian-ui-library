// @noflow

import React from 'react';
import RefinementBar, { AvatarSelectFilter } from '../src';

const CONFIG = {
  assignee: {
    label: 'Assignee',
    type: AvatarSelectFilter,
    options: [
      {
        value: 'andrew-clark',
        label: 'Andrew Clark',
        avatar: `http://i.pravatar.cc/48?u=andrew-clark`,
      },
      {
        value: 'brian-vaughn',
        label: 'Brian Vaughn',
        avatar: `http://i.pravatar.cc/48?u=brian-vaughn`,
      },
      {
        value: 'cheng-lou',
        label: 'Cheng Lou',
        avatar: `http://i.pravatar.cc/48?u=cheng-lou`,
      },
      {
        value: 'christopher-chedeau',
        label: 'Christopher Chedeau',
        avatar: `http://i.pravatar.cc/48?u=christopher-chedeau`,
      },
      {
        value: 'dan-abromov',
        label: 'Dan Abromov',
        avatar: `http://i.pravatar.cc/48?u=dan-abromov`,
      },
      {
        value: 'kent-c-dodds',
        label: 'Kent C. Dodds',
        avatar: `http://i.pravatar.cc/48?u=kent-c-dodds`,
      },
      {
        value: 'lee-byron',
        label: 'Lee Byron',
        avatar: `http://i.pravatar.cc/48?u=lee-byron`,
      },
      {
        value: 'paul-oshannessy',
        label: 'Paul O’Shannessy',
        avatar: `http://i.pravatar.cc/48?u=paul-oshannessy`,
      },
      {
        value: 'pete-hunt',
        label: 'Pete Hunt',
        avatar: `http://i.pravatar.cc/48?u=pete-hunt`,
      },
      {
        value: 'sebastian-markbage',
        label: 'Sebastian Markbåge',
        avatar: `http://i.pravatar.cc/48?u=sebastian-markbage`,
      },
      {
        value: 'sophie-alpert',
        label: 'Sophie Alpert',
        avatar: `http://i.pravatar.cc/48?u=sophie-alpert`,
      },
      {
        value: 'sunil-pai',
        label: 'Sunil Pai',
        avatar: `http://i.pravatar.cc/48?u=sunil-pai`,
      },
    ],
  },
};

export default function AvatarSelectFilterConfigReference() {
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
