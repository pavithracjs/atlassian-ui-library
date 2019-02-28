import * as React from 'react';
import Button, { ButtonGroup } from '../src';
import { NachosTheme } from './Nachos/NachosButton';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import { Theme } from '../src/theme';

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
    <Theme.Provider value={NachosTheme}>
      <ButtonGroup>
        <Button iconBefore={<AddIcon label="add" />}>Button</Button>
        <Button appearance="primary">Button</Button>
        <Button appearance="disabled">Button</Button>
        <Button appearance="danger" isLoading>
          Button
        </Button>
      </ButtonGroup>
    </Theme.Provider>
  </div>
);
