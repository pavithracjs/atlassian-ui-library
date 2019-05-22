import * as React from 'react';
import { Component } from 'react';
import StatefulAvatarPickerDialog from '../example-helpers/StatefulAvatarPickerDialog';
import { CONTAINER_SIZE } from '../src/image-navigator';
import { ViewportDebugger } from '../example-helpers/viewport-debug';

class Example extends Component<{}, {}> {
  debugView?: ViewportDebugger;

  componentDidMount = () => {
    this.debugView = new ViewportDebugger(
      { x: 10, y: 10 },
      { x: 10, y: CONTAINER_SIZE + 20 },
    );
  };

  render() {
    return <StatefulAvatarPickerDialog />;
  }
}

export default () => <Example />;
