// @noflow

import React from 'react';
import RefinementBar, { TextFilter } from '../src';

const CONFIG = {
  browser: {
    label: 'Browser',
    type: TextFilter,
    note: 'The browser(s) in which this issue is reproducible.',
    validate: ({ type, value }) => {
      const INVALID_FIRST_CHARS = ['*', '?'];

      if (type === 'is_not_set') {
        return null;
      }
      if (!value) {
        return 'Please provide some text.';
      }
      if (INVALID_FIRST_CHARS.includes(value.charAt(0))) {
        return "The '*' and '?' are not allowed as first character in a 'wildard' search.";
      }

      return null;
    },
  },
};

export default function TextFilterConfigReference() {
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
