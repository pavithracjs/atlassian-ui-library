import * as React from 'react';
import { md, code, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="warning">
    <p>
      <strong>
        Note: This component is designed for internal Atlassian development.
      </strong>
    </p>
    <p>
      External contributors will be able to use this component but will not be
      able to submit issues.
    </p>
  </SectionMessage>
)}
MediaViewer is Atlassian's powerful solution for viewing files on the web. It's both powerful and extendable yet easy-to-integrate

  ## Usage

  ### Using a collection as data source

  ${code`
  import { MediaViewer } from '@atlaskit/media-viewer';
  import {
    createStorybookContext,
    defaultCollectionName,
  } from '@atlaskit/media-test-helpers';

  const context = createStorybookContext();
  const selectedItem = {
    id: 'some-valid-id',
    occurrenceKey: '',
    type: 'file',
  };

  const pageSize = 30;

  const dataSource = {
    collectionName: defaultCollectionName,
  };

  export default () => (
    <MediaViewer
      pageSize={pageSize}
      context={context}
      selectedItem={selectedItem}
      dataSource={dataSource}
      collectionName={defaultCollectionName}
    />
  );
  `}

  ### Using a list of media items as data source

  ${code`
  import { MediaViewer } from '@atlaskit/media-viewer';
  import {
    createStorybookContext,
    defaultCollectionName,
  } from '@atlaskit/media-test-helpers';

  const context = createStorybookContext();

  const items = [
    {
      id: 'some-valid-id-1',
      occurrenceKey: 'key1',
      type: 'file',
    },
    {
      id: 'some-valid-id-2',
      occurrenceKey: 'item-1',
      type: 'file',
    },
    {
      id: 'some-valid-id-2',
      occurrenceKey: 'item-2',
      type: 'file',
    },
  ];

  const selectedItem = items[1];

  const dataSource = {
    list: items,
  };

  export default () => (
    <MediaViewer
      context={context}
      selectedItem={selectedItem}
      dataSource={dataSource}
      collectionName={defaultCollectionName}
    />
  );
  `}

  ## About the collectionName parameter

  The collection name can be provided as top level prop \`collectionName\` for authentcation purposes
  (for collection scoped permissions) and / or as a \`dataSource\` for collection scoped navigation.

  ${(
    <Example
      Component={require('../examples/0-single-file-previews').default}
      title="Single File Preview"
      source={require('!!raw-loader!../examples/0-single-file-previews')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/media-viewer')}
    />
  )}
  `;
