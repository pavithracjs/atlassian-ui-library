// @noflow

import React from 'react';
import RefinementBar, { SelectFilter, SearchFilter } from '../src';
import { Heading, Pre } from './styled';

export default class ChangeMetaExample extends React.Component {
  state = {
    log: [],
    value: {
      search: '',
    },
  };

  logRef = React.createRef();

  addLog = meta => {
    this.setState(
      state => {
        const log = [...state.log];
        log.push(`action: "${meta.action}" (${meta.key})`);
        return { log };
      },
      () => {
        const el = this.logRef.current;
        el.scrollTo(0, el.scrollHeight);
      },
    );
  };

  onChange = (value, meta) => {
    this.addLog(meta);

    switch (meta.action) {
      case 'add':
        this.addValue({ [meta.key]: meta.data });
        break;
      case 'remove':
        this.removeValue(meta.key);
        break;
      case 'update':
      case 'clear':
        this.updateValue(value);
        break;
      default:
    }
  };

  addValue = add => {
    this.setState(state => ({ value: { ...state.value, ...add } }));
  };

  removeValue = (remove: string) => {
    this.setState(state => {
      const { value } = state;
      delete value[remove];

      return { value };
    });
  };

  updateValue = value => {
    this.setState({ value });
  };

  render() {
    return (
      <div style={{ padding: 20 }}>
        <RefinementBar
          fieldConfig={FIELD_CONFIG}
          irremovableKeys={['search']}
          onChange={this.onChange}
          value={this.state.value}
        />
        <Heading>Log</Heading>
        <Pre ref={this.logRef} style={{ maxHeight: 400, overflowY: 'auto' }}>
          {this.state.log.join('\n')}
        </Pre>
      </div>
    );
  }
}

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
