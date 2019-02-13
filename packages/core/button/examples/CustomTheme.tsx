import * as React from 'react';
import Button, { ButtonGroup } from '../src';
import ThemedButton from './CustomTheme/ThemedButton';
import { AtlassianIcon } from '@atlaskit/logo';
import AddIcon from '@atlaskit/icon/glyph/editor/add';

export default () => (
  <div style={{ margin: 20 }}>
    <h3 style={{ marginBottom: 15 }}>ADG Button</h3>
    <ButtonGroup>
      <Button iconBefore={<AddIcon />}>Button</Button>
      <Button appearance="primary">Button</Button>
      <Button appearance="warning">Button</Button>
      <Button appearance="danger" isLoading>
        Button
      </Button>
    </ButtonGroup>

    <h3 style={{ marginBottom: 15 }}>Themed Button</h3>
    <ButtonGroup>
      <ThemedButton iconBefore={<AddIcon />}>Button</ThemedButton>
      <ThemedButton appearance="primary">Button</ThemedButton>
      <ThemedButton appearance="disabled">Button</ThemedButton>
      <ThemedButton appearance="danger" isLoading>
        Button
      </ThemedButton>
    </ButtonGroup>
  </div>
);
