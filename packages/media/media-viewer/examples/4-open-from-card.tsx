import * as React from 'react';
import { Card } from '@atlaskit/media-card';
import {
  createStorybookContext,
  externalImageIdentifier,
  externalSmallImageIdentifier,
  imageFileId,
  docFileId,
  animatedFileId,
} from '@atlaskit/media-test-helpers';

const context = createStorybookContext();
const defaultList = [
  animatedFileId,
  imageFileId,
  externalSmallImageIdentifier,
  docFileId,
];
const listWithCurrentIdentifier = [externalImageIdentifier, ...defaultList];
const listWithoutCurrentIdentifier = [...defaultList];

export default () => (
  <div>
    <h1>Datasource with current identifier</h1>
    <Card
      shouldOpenMediaViewer
      context={context}
      identifier={externalImageIdentifier}
      mediaViewerDataSource={{ list: listWithCurrentIdentifier }}
    />
    <h1>Datasource without current identifier</h1>
    <Card
      shouldOpenMediaViewer
      context={context}
      identifier={externalImageIdentifier}
      mediaViewerDataSource={{ list: listWithoutCurrentIdentifier }}
    />
  </div>
);
