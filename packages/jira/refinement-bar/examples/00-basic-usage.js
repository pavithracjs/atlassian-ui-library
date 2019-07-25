// @noflow

import React from 'react';
import RefinementBar, { SearchFilter } from '../src';

export default class BasicUsageExample extends React.Component {
  state = { value: { search: '' } };

  onChange = value => {
    this.setState({ value });
  };

  render() {
    return (
      <div style={{ padding: 20 }}>
        <RefinementBar
          fieldConfig={{ search: { label: 'Search', type: SearchFilter } }}
          irremovableKeys={['search']}
          onChange={this.onChange}
          value={this.state.value}
        />
      </div>
    );
  }
}
