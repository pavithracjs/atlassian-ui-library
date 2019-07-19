// @noflow

import React from 'react';
import RefinementBar, { SearchFilter } from '../src';
import { Hr } from './styled';

export default class FieldRefsExample extends React.Component {
  state = {
    value: {
      search: '',
    },
  };

  onChange = value => {
    this.setState({ value });
  };

  refinementBarRefs = {
    search: React.createRef(),
  };

  render() {
    return (
      <div style={{ padding: 20 }}>
        <RefinementBar
          refs={this.refinementBarRefs}
          fieldConfig={{
            search: {
              label: 'Search',
              type: SearchFilter,
            },
          }}
          irremovableKeys={['search']}
          onChange={this.onChange}
          value={this.state.value}
        />
        <Hr />
        <button
          onClick={() => {
            this.refinementBarRefs.search.current.focus();
          }}
        >
          Focus search
        </button>
      </div>
    );
  }
}
