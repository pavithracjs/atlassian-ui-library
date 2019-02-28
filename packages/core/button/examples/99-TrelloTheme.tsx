import * as React from 'react';
import Button, { ButtonGroup } from '../src';
import NachosButton from './Nachos/NachosButton';
import AddIcon from '@atlaskit/icon/glyph/editor/add';

export default () => (
  <div style={{ margin: 20 }}>
    <h3 style={{ marginBottom: 15 }}>ADG Button</h3>
    <ButtonGroup>
      <Button iconBefore={<AddIcon label="add" />} isLoading>
        Button
      </Button>
      <Button appearance="primary">Button</Button>
      <Button appearance="warning">Button</Button>
      <Button appearance="danger" isLoading>
        Button
      </Button>
    </ButtonGroup>

    <h3 style={{ marginBottom: 15 }}>Nachos Button</h3>
    <ButtonGroup>
      <NachosButton iconBefore={<AddIcon label="add" />} isLoading>
        Button
      </NachosButton>
      <NachosButton appearance="primary">Button</NachosButton>
      <NachosButton appearance="disabled">Button</NachosButton>
      <NachosButton appearance="danger" isLoading>
        Button
      </NachosButton>
    </ButtonGroup>
  </div>
);
