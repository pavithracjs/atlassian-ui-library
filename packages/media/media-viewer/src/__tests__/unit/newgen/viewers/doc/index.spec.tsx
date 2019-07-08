import * as React from 'react';
import { ProcessedFileState } from '@atlaskit/media-client';
import { Spinner } from '../../../../../newgen/loading';
import { DocViewer, Props } from '../../../../../newgen/viewers/doc/index';
import {
  mountWithIntlContext,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { BaseState } from '../../../../../newgen/viewers/base-viewer';
import { Content } from '../../../../../newgen/content';

function createFixture(
  fetchPromise: Promise<any>,
  item: ProcessedFileState,
  collectionName?: string,
  mockReturnGetArtifactURL?: Promise<string>,
) {
  const mediaClient = fakeMediaClient();
  const onClose = jest.fn(() => fetchPromise);

  jest
    .spyOn(mediaClient.file, 'getArtifactURL')
    .mockReturnValue(
      mockReturnGetArtifactURL ||
        Promise.resolve(
          'some-base-url/document?client=some-client-id&token=some-token',
        ),
    );

  const el = mountWithIntlContext<Props, BaseState<Content>>(
    <DocViewer
      item={item}
      mediaClient={mediaClient}
      collectionName={collectionName}
    />,
  );
  (el as any).instance()['fetch'] = jest.fn();
  return { mediaClient, el, onClose };
}

const item: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'my pdf',
  size: 11222,
  mediaType: 'video',
  mimeType: 'mp4',
  artifacts: {
    'document.pdf': {
      url: '/pdf',
      processingStatus: 'succeeded',
    },
  },
  representations: {},
};

describe('DocViewer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('assigns a document content when successful', async () => {
    const fetchPromise = Promise.resolve();
    const { el } = createFixture(fetchPromise, item);
    await (el as any).instance()['init']();

    expect(el.state().content.status).toEqual('SUCCESSFUL');
  });

  it('shows an indicator while loading', async () => {
    const fetchPromise = new Promise(() => {});
    const { el } = createFixture(fetchPromise, item);
    await (el as any).instance()['init']();

    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('MSW-720: passes collectionName to getArtifactURL', async () => {
    const collectionName = 'some-collection';
    const fetchPromise = Promise.resolve();
    const { el, mediaClient } = createFixture(
      fetchPromise,
      item,
      collectionName,
    );
    await (el as any).instance()['init']();
    expect(
      (mediaClient.file.getArtifactURL as jest.Mock).mock.calls[0][2],
    ).toEqual(collectionName);
  });
});
