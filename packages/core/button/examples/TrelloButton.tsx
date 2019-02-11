import * as React from 'react';
import Button, { ButtonGroup } from '../src';
import NachosButton from './Nachos/NachosButton';
import { AtlassianIcon } from '@atlaskit/logo';

export default () => (
  <div style={{ margin: 20 }}>
    <h3 style={{ marginBottom: 15 }}>ADG Button</h3>
    <ButtonGroup>
      <Button iconBefore={<AtlassianIcon />}>Button</Button>
      <Button appearance="primary">Button</Button>
      <Button appearance="warning">Button</Button>
      <Button appearance="danger" isLoading>
        Button
      </Button>
    </ButtonGroup>

    <h3 style={{ marginBottom: 15 }}>Nachos Button</h3>
    <ButtonGroup>
      <NachosButton iconBefore={<AtlassianIcon />}>Button</NachosButton>
      <NachosButton appearance="primary">Button</NachosButton>
      <NachosButton appearance="subtle">Button</NachosButton>
      <NachosButton appearance="danger" isLoading>
        Button
      </NachosButton>
    </ButtonGroup>
  </div>
);
