// @noflow

import React from 'react';

import { Heading, PreMap } from './styled';
import {
  SearchFilter,
  SelectFilter,
  RefinementBarUI,
  RefinementBarProvider,
  RefinementBarConsumer,
  useRefinementBar,
} from '../src';

export default class AccessingContextExample extends React.Component {
  state = {
    value: {
      capitals: [],
      search: '',
    },
  };

  onChange = value => {
    this.setState({ value });
  };

  render() {
    return (
      <RefinementBarProvider
        fieldConfig={FIELD_CONFIG}
        irremovableKeys={['search', 'capitals']}
        onChange={this.onChange}
        value={this.state.value}
      >
        <div style={{ padding: 20 }}>
          <RefinementBarUI />
          <ViaRenderProp />
          <ViaHook />
        </div>
      </RefinementBarProvider>
    );
  }
}

const ViaRenderProp = () => (
  <RefinementBarConsumer>
    {({ value }) => (
      <>
        <Heading>Render Prop</Heading>
        <PreMap value={value} />
      </>
    )}
  </RefinementBarConsumer>
);

const ViaHook = () => {
  const { value } = useRefinementBar();
  return (
    <>
      <Heading>Hook</Heading>
      <PreMap value={value} />
    </>
  );
};

// Data
// ------------------------------

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

const FIELD_CONFIG = {
  search: {
    label: 'Search',
    type: SearchFilter,
  },
  capitals: {
    label: 'Capitals',
    type: SelectFilter,
    options: CAPITALS,
  },
};
