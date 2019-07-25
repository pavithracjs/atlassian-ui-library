import React from 'react';
import Avatar from '@atlaskit/avatar';
import Tag from '../src';

export default () => (
  <div>
    <Tag text="Base Tag" />
    <Tag
      appearance="rounded"
      text="Avatar Before"
      elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
    />
    <Tag text="Linked Tag" href="/components/tag" />
    <Tag text="Rounded Tag" appearance="rounded" />
    <Tag text="Removable button" removeButtonText="Remove" />
    <Tag
      text="Removal halted"
      removeButtonText="Remove"
      onBeforeRemoveAction={() => {
        console.log('Removal halted'); // eslint-disable-line no-console
        return false;
      }}
    />
    <Tag
      text="Post Removal Hook"
      removeButtonText="Remove"
      onBeforeRemoveAction={() => {
        console.log('Before removal'); // eslint-disable-line no-console
        return true;
      }}
      onAfterRemoveAction={e => console.log('After removal', e)} // eslint-disable-line no-console
    />
  </div>
);
