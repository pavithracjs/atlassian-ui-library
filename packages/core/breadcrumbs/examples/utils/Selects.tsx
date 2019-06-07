import React from 'react';
import Select from '@atlaskit/select';

const styles = {
  container: (base: any) => ({
    ...base,
    margin: '8px',
    width: '160px',
    display: 'inline-block',
  }),
};

const options = [
  { label: '0', value: 0 },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
  { label: '6', value: 6 },
  { label: '7', value: 7 },
  { label: '8', value: 8 },
  { label: '9', value: 9 },
  { label: '10', value: 10 },
  { label: '11', value: 11 },
];

interface Props {
  onChange: ({ label, value }: { label: string; value: number }) => any;
}

const BeforeItemsSelect = ({ onChange }: Props) => (
  <Select
    styles={styles}
    options={options}
    defaultValue={{ label: '2', value: 2 }}
    onChange={onChange}
    placeholder="Items Before Collapse"
  />
);

const AfterItemsSelect = ({ onChange }: Props) => (
  <Select
    styles={styles}
    options={options}
    defaultValue={{ label: '0', value: 0 }}
    onChange={onChange}
    placeholder="Items Before Collapse"
  />
);

export { AfterItemsSelect, BeforeItemsSelect };
