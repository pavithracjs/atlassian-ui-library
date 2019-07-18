// @noflow

import React from 'react';
import RefinementBar, { SelectFilter } from '../src';
import { Hr } from './styled';

export default class ControlledPopupsExample extends React.Component {
  state = {
    activePopupKey: null,
    value: {
      capitals: [],
    },
  };

  onChange = value => {
    this.setState({ value });
  };

  onPopupOpen = activePopupKey => {
    this.setState({ activePopupKey });
  };

  onPopupClose = () => {
    this.setState({ activePopupKey: null });
  };

  render() {
    return (
      <React.Fragment>
        <div style={{ padding: 20 }}>
          <RefinementBar
            fieldConfig={{
              capitals: {
                label: 'Capitals',
                type: SelectFilter,
                options: CAPITALS,
              },
            }}
            irremovableKeys={['capitals']}
            onChange={this.onChange}
            value={this.state.value}
            activePopupKey={this.state.activePopupKey}
            onPopupOpen={this.onPopupOpen}
            onPopupClose={this.onPopupClose}
          />
          <Hr />
          <button onClick={() => this.onPopupOpen('capitals')}>
            Open capitals
          </button>
        </div>
      </React.Fragment>
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
