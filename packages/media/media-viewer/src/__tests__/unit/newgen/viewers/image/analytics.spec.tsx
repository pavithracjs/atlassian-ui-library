import {
  setState as setInteractiveImgState,
  InteractiveImg as InteractiveImgMock,
} from '../../../../mocks/_interactive-img';

const mockInteractiveImg = {
  InteractiveImg: InteractiveImgMock,
};
jest.mock(
  '../../../../../newgen/viewers/image/interactive-img',
  () => mockInteractiveImg,
);

import * as React from 'react';
import { ProcessedFileState } from '@atlaskit/media-client';
import {
  awaitError,
  mountWithIntlContext,
  fakeMediaClient,
  asMock,
} from '@atlaskit/media-test-helpers';
import { ImageViewer } from '../../../../../newgen/viewers/image';

const collectionName = 'some-collection';
const imageItem: ProcessedFileState = {
  id: 'some-id',
  status: 'processed',
  name: 'my image',
  size: 11222,
  mediaType: 'image',
  mimeType: 'jpeg',
  artifacts: {},
  representations: {
    image: {},
  },
};

function createFixture(response: Promise<Blob>) {
  const mediaClient = fakeMediaClient();
  asMock(mediaClient.getImage).mockReturnValue(response);
  const onClose = jest.fn();
  const onLoaded = jest.fn();
  const el = mountWithIntlContext(
    <ImageViewer
      mediaClient={mediaClient}
      item={imageItem}
      collectionName={collectionName}
      onClose={onClose}
      onLoad={onLoaded}
    />,
  );

  return { mediaClient, el, onClose };
}

describe('ImageViewer analytics', () => {
  it('should call onLoad with success', async () => {
    setInteractiveImgState('success');
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    await response;
    expect(el.prop('onLoad')).toHaveBeenCalledWith({ status: 'success' });
  });

  it('should call onLoad with error if interactive-img fails', async () => {
    setInteractiveImgState('error');
    const response = Promise.resolve(new Blob());
    const { el } = createFixture(response);

    await response;
    expect(el.prop('onLoad')).toHaveBeenCalledWith({
      status: 'error',
      errorMessage: 'Interactive-img render failed',
    });
  });

  it('should call onLoad with error if there is an error fetching metadata', async () => {
    const response = Promise.reject(new Error('test_error'));
    const { el } = createFixture(response);

    await awaitError(response, 'test_error');
    expect(el.prop('onLoad')).toHaveBeenCalledWith({
      status: 'error',
      errorMessage: 'test_error',
    });
  });
});
