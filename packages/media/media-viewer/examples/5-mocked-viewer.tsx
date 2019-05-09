import * as React from 'react';
import { canUseDOM } from 'exenv';

import { FileIdentifier, ContextFactory } from '@atlaskit/media-core';
import { MediaFile } from '@atlaskit/media-store';
import {
  MediaMock,
  defaultCollectionName,
  smallImage,
  tallImage,
  defaultBaseUrl,
  generateFilesFromTestData,
} from '@atlaskit/media-test-helpers';

import { wideImage } from '../example-helpers/assets/wide-image';
import { MediaViewer } from '../src/components/media-viewer';

let files: Array<MediaFile & { blob: Blob }> = [];

if (canUseDOM) {
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

  files = generateFilesFromTestData([
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
}

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
    if (files.length === 0) {
      return null;
    }
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
