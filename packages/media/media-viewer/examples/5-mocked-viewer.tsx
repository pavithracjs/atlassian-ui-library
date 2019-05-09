import * as React from 'react';

import {
  MediaMock,
  defaultCollectionName,
  smallImage,
  tallImage,
  defaultBaseUrl,
  generateFilesFromTestData,
} from '@atlaskit/media-test-helpers';
import { FileIdentifier, ContextFactory } from '@atlaskit/media-core';

import { wideImage } from '../example-helpers/assets/wide-image';
import { MediaViewer } from '../src/components/media-viewer';

(window as any).areControlsRendered = () => {
  return !!document.querySelector('.mvng-hide-controls');
};

(window as any).areControlsVisible = () => {
  const controls = document.querySelector('.mvng-hide-controls');
  if (!controls) {
    return false;
  } else {
    return window.getComputedStyle(controls).opacity === '1';
  }
};

const files = generateFilesFromTestData([
  {
    name: 'media-test-file-1.png',
    dataUri: smallImage,
  },
  {
    name: 'media-test-file-2.jpg',
    dataUri: wideImage,
  },
  {
    name: 'media-test-file-3.png',
    dataUri: tallImage,
  },
]);
const mediaMock = new MediaMock({
  [defaultCollectionName]: files,
});
mediaMock.enable();

const context = ContextFactory.create({
  authProvider: () =>
    Promise.resolve({
      clientId: '',
      token: '',
      baseUrl: defaultBaseUrl,
    }),
});
export default class Example extends React.Component<{}, {}> {
  render() {
    return (
      <MediaViewer
        dataSource={{
          list: files.map(
            ({ id }) =>
              ({
                id,
                collectionName: defaultCollectionName,
                mediaItemType: 'file',
              } as FileIdentifier),
          ),
        }}
        selectedItem={{
          id: files[1].id,
          collectionName: defaultCollectionName,
          mediaItemType: 'file',
        }}
        collectionName={defaultCollectionName}
        context={context}
      />
    );
  }
}
