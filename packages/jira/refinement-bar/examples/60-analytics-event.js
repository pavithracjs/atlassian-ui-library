// @noflow

import React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import RefinementBar, {
  NumberFilter,
  SelectFilter,
  SearchFilter,
} from '../src';
import { Heading, Pre } from './styled';

export default class AnalyticsEventExample extends React.Component {
  state = {
    log: [],
    value: {},
  };

  logRef = React.createRef();

  addLog = ({ payload }) => {
    if (payload.action === 'idle-submit') {
      this.setState(
        state => {
          const log = [...state.log];
          log.push(JSON.stringify(payload, null, 2));
          return { log };
        },
        () => {
          const el = this.logRef.current;
          el.scrollTo(0, el.scrollHeight);
        },
      );
    }
  };

  onChange = value => {
    this.setState({ value });
  };

  render() {
    return (
      <AnalyticsListener channel="atlaskit" onEvent={this.addLog}>
        <div style={{ padding: 20 }}>
          <RefinementBar
            fieldConfig={FIELD_CONFIG}
            irremovableKeys={['search']}
            onChange={this.onChange}
            value={this.state.value}
          />
          <Heading>Payload</Heading>
          <Pre ref={this.logRef} style={{ maxHeight: 400, overflowY: 'auto' }}>
            {this.state.log.join('\n')}
          </Pre>
        </div>
      </AnalyticsListener>
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
  votes: {
    label: 'Votes',
    type: NumberFilter,
  },
};
