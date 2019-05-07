import * as React from 'react';

import {
  MediaMock,
  defaultCollectionName,
  smallImage,
  tallImage,
  defaultBaseUrl,
  generateFilesFromTestData,
} from '@atlaskit/media-test-helpers';
import { MediaFile } from '@atlaskit/media-store';
import { FileIdentifier, ContextFactory } from '@atlaskit/media-core';

import { wideImage } from '../example-helpers/assets/wide-image';
import { MediaViewer } from '../src/components/media-viewer';

export interface State {
  files?: Array<MediaFile>;
}
export default class Example extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
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

    this.setState({
      files,
    });
  }

  render() {
    const { files } = this.state;
    if (!files || files.length === 0) {
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
        context={ContextFactory.create({
          authProvider: () =>
            Promise.resolve({
              clientId: '',
              token: '',
              baseUrl: defaultBaseUrl,
            }),
        })}
      />
    );
  }
}
