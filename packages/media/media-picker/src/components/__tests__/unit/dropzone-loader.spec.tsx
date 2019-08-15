import * as React from 'react';
import { mount } from 'enzyme';
import { fakeMediaClient, nextTick } from '@atlaskit/media-test-helpers';

import {
  DropzoneLoader,
  DropzoneWithMediaClientConfigProps,
  State,
} from '../../dropzone';
import MediaPickerAnalyticsErrorBoundary from '../../media-picker-analytics-error-boundary';

const mediaClient = fakeMediaClient();
const container = document.createElement('div');

const config = { container, uploadParams: {} };

describe('Dropzone Async Loader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the async import returns with error', () => {
    beforeEach(() => {
      jest.mock('../../dropzone/dropzone', () => {
        throw new Error('Forcing async import error');
      });
    });

    it('should NOT render Dropzone component', () => {
      const wrapper = mount<DropzoneWithMediaClientConfigProps, State>(
        <DropzoneLoader
          mediaClientConfig={mediaClient.config}
          config={config}
        />,
      );

      expect(wrapper.state().Dropzone).toBeUndefined();
    });
  });

  describe('When the async import returns with success', () => {
    beforeEach(() => {
      jest.unmock('../../dropzone/dropzone');
      jest.mock('../../../service/uploadServiceImpl');
    });

    it('should render Dropzone component', async () => {
      const wrapper = await mount<DropzoneWithMediaClientConfigProps, State>(
        <DropzoneLoader
          mediaClientConfig={mediaClient.config}
          config={config}
        />,
      );

      await nextTick();

      expect(wrapper.state().Dropzone).not.toBeUndefined();
    });

    it('should render Error boundary component', async () => {
      const wrapper = await mount<DropzoneWithMediaClientConfigProps, State>(
        <DropzoneLoader
          mediaClientConfig={mediaClient.config}
          config={config}
        />,
      );
      await nextTick();
      expect(wrapper.find(MediaPickerAnalyticsErrorBoundary)).toBeDefined();
    });
  });
});
