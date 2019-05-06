import * as React from 'react';

import {
  MediaMock,
  defaultCollectionName,
  smallImage,
  tallImage,
  wideImage,
  defaultBaseUrl,
} from '@atlaskit/media-test-helpers';
import { MediaFile } from '@atlaskit/media-store';
import { FileIdentifier, ContextFactory } from '@atlaskit/media-core';

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
    const mediaMock = new MediaMock(
      {},
      {
        'media-test-file-1.jpg': smallImage,
        'media-test-file-2.jpg': tallImage,
        'media-test-file-3.jpg': wideImage,
      },
    );
    const testData = await mediaMock.enable();
    if (testData) {
      this.setState({
        files: await testData[1],
      });
    }
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
