import * as React from 'react';
import { mount } from 'enzyme';
import { fakeMediaClient, nextTick } from '@atlaskit/media-test-helpers';
import { Identifier } from '@atlaskit/media-client';

import { ModalSpinner } from '@atlaskit/media-ui';
import AsyncMediaViewer, {
  MediaViewerWithContextMediaClientConfigProps,
  AsyncMediaViewerState,
} from '../../components/media-viewer-loader';

const mediaClient = fakeMediaClient();

const identifier: Identifier = {
  id: '123',
  mediaItemType: 'file',
  collectionName: 'some-name',
};

const props = {
  mediaClientConfig: mediaClient.config,
  selectedItem: identifier,
  dataSource: { list: [identifier] },
  collectionName: `${identifier.collectionName}`,
};

describe('Async Media Viewer Loader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the async import returns with error', () => {
    beforeEach(() => {
      jest.mock('../../components/media-viewer', () => {
        throw new Error('Forcing async import error');
      });
    });

    it('should render ModalSpinner with invertSpinnerColor if the async components were NOT resolved', async () => {
      const wrapper = mount<
        MediaViewerWithContextMediaClientConfigProps,
        AsyncMediaViewerState
      >(<AsyncMediaViewer {...props} />);

      await nextTick();

      expect(
        wrapper.find(ModalSpinner).prop('invertSpinnerColor'),
      ).toBeTruthy();

      expect(wrapper.state().MediaViewer).toBeUndefined();
    });
  });

  describe('When the async import returns with success', () => {
    beforeEach(() => {
      jest.unmock('../../components/media-viewer');
    });

    it('should render MediaViewer component', async () => {
      const wrapper = await mount<
        MediaViewerWithContextMediaClientConfigProps,
        AsyncMediaViewerState
      >(<AsyncMediaViewer {...props} />);

      await nextTick();

      expect(wrapper.state().MediaViewer).not.toBeUndefined();
    });
  });
});
