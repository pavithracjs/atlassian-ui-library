import * as React from 'react';
import Button, { ButtonGroup } from '../src';

const Row: React.FC = () => <div style={{ padding: 8 }} />;

export default () => (
  <Row>
    <Row>
      <ButtonGroup>
        <Button appearance="primary">First Button</Button>
        <Button appearance="default">Second Button</Button>
        <Button appearance="warning">Third Button</Button>
        <Button appearance="link">Fourth Button</Button>
      </ButtonGroup>
    </Row>
    <Row>
      <ButtonGroup appearance="primary">
        <Button>Angular</Button>
        <Button>Ember</Button>
        <Button>React</Button>
      </ButtonGroup>
    </Row>
  </Row>
);
