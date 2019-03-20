// @flow
import React from 'react';

import { BreadcrumbsStateless, BreadcrumbsItem } from '@atlaskit/breadcrumbs';
import Button, { ButtonGroup } from '@atlaskit/button';
import TextField from '@atlaskit/textfield';
import Select from '@atlaskit/select';
import { InlineEditableTextfield } from '@atlaskit/inline-edit';

import PageHeader from '../src';

const breadcrumbs = (
  <BreadcrumbsStateless onExpand={() => {}}>
    <BreadcrumbsItem text="Some project" key="Some project" />
    <BreadcrumbsItem text="Parent page" key="Parent page" />
  </BreadcrumbsStateless>
);
const actionsContent = (
  <ButtonGroup>
    <Button appearance="primary">Primary Action</Button>
    <Button>Default</Button>
    <Button>...</Button>
  </ButtonGroup>
);
const barContent = (
  <div style={{ display: 'flex' }}>
    <div style={{ flex: '0 0 200px' }}>
      <TextField isCompact placeholder="Filter" aria-label="Filter" />
    </div>
    <div style={{ flex: '0 0 200px', marginLeft: 8 }}>
      <Select
        spacing="compact"
        placeholder="Choose an option"
        aria-label="Choose an option"
      />
    </div>
  </div>
);

const CustomTitleComponent = () => (
  <InlineEditableTextfield
    defaultValue="Editable title"
    onConfirm={() => {}}
    onCancel={() => {}}
    theme={{
      fontSize: '24px',
      fontWeight: '500',
    }}
  />
);

export default () => (
  <PageHeader
    breadcrumbs={breadcrumbs}
    bottomBar={barContent}
    actions={actionsContent}
    disableTitleStyles
  >
    <CustomTitleComponent />
  </PageHeader>
);
