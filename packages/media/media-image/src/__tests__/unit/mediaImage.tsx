import * as React from 'react';
import { shallow } from 'enzyme';
import { Observable } from 'rxjs';
import {
  nextTick,
  asMock,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { MediaClient } from '@atlaskit/media-client';
import MediaImage, { MediaImageProps } from '../../mediaImage';

import { imageFileId } from '@atlaskit/media-test-helpers';

const shallowRender = async (props: MediaImageProps) => {
  const wrapper = shallow<MediaImage, MediaImageProps, any>(
    <MediaImage {...props}>
      {({ loading, error, data }) => {
        if (loading) {
          return <div>loading</div>;
        }

        if (error) {
          return <div>error</div>;
        }

        if (!data) {
          return null;
        }

        return <img src={data.src} />;
      }}
    </MediaImage>,
  );

  await nextTick();

  return wrapper;
};

describe('<MediaImage />', () => {
  let defaultProps: MediaImageProps;
  let mediaClient: MediaClient;
  const getFileState = jest.fn();
  const getImage = jest.fn();

  beforeEach(() => {
    jest.spyOn(URL, 'revokeObjectURL');

    getFileState.mockReturnValue(
      Observable.of({
        status: 'processed',
        mediaType: 'image',
      }),
    );

    getImage.mockReturnValue({});

    mediaClient = fakeMediaClient();
    asMock(mediaClient.file.getFileState).mockImplementation(getFileState);
    asMock(mediaClient.getImage).mockImplementation(getImage);

    defaultProps = {
      apiConfig: {
        width: 100,
        height: 100,
        upscale: true,
        mode: 'full-fit',
      },
      identifier: imageFileId,
      mediaClient,
      children: () => ({} as any),
    };
  });

  afterEach(() => {
    getFileState.mockReset();
    getImage.mockReset();
    jest.resetAllMocks();
  });

  it('should render error placeholder if request fails', async () => {
    const getFileState = jest.fn().mockReturnValue(
      Observable.create((observer: { error: Function }) => {
        observer.error('');
      }),
    );

    const newMediaClient = fakeMediaClient();
    asMock(newMediaClient.file.getFileState).mockImplementation(getFileState);
    asMock(newMediaClient.getImage).mockImplementation(getImage);

    const props = {
      ...defaultProps,
      mediaClient: newMediaClient,
    };
    const wrapper = await shallowRender(props);

    expect(wrapper.find('div').text()).toEqual('error');
  });

  it('should render error placeholder if the media type is NOT an image', async () => {
    const getFileState = jest
      .fn()
      .mockReturnValue(
        Observable.of({ status: 'processed', mediaType: 'doc' }),
      );
    const getImage = jest.fn().mockReturnValue({});
    const mediaClient = fakeMediaClient();
    asMock(mediaClient.file.getFileState).mockImplementation(getFileState);
    asMock(mediaClient.getImage).mockImplementation(getImage);

    const newMediaClient = fakeMediaClient();
    asMock(newMediaClient.file.getFileState).mockImplementation(getFileState);
    asMock(newMediaClient.getImage).mockImplementation(getImage);

    const props = {
      ...defaultProps,
      mediaClient: newMediaClient,
    };

    const wrapper = await shallowRender(props);

    expect(wrapper.find('div').text()).toEqual('error');
  });

  it('should render error placeholder if the request status is `error`', async () => {
    const getFileState = jest
      .fn()
      .mockReturnValue(Observable.of({ status: 'error', mediaType: 'image' }));

    const newMediaClient = fakeMediaClient();
    asMock(newMediaClient.file.getFileState).mockImplementation(getFileState);
    asMock(newMediaClient.getImage).mockImplementation(getImage);

    const props = {
      ...defaultProps,
      mediaClient: newMediaClient,
    };
    const wrapper = await shallowRender(props);

    expect(wrapper.find('div').text()).toEqual('error');
  });

  it('should remove subscription if the component is unmounted', async () => {
    const wrapper = await shallowRender(defaultProps);
    const instance = wrapper.instance();
    jest.spyOn(instance, 'unsubscribe');

    wrapper.unmount();

    expect(instance.unsubscribe).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it('should render a placeholder while the src is loading', async () => {
    const getFileState = jest
      .fn()
      .mockReturnValue(
        Observable.of({ status: 'loading', mediaType: 'image' }),
      );

    const newMediaClient = fakeMediaClient();
    asMock(newMediaClient.file.getFileState).mockImplementation(getFileState);
    asMock(newMediaClient.getImage).mockImplementation(getImage);

    const props = {
      ...defaultProps,
      mediaClient: newMediaClient,
    };
    const wrapper = await shallowRender(props);

    expect(wrapper.find('div').text()).toEqual('loading');
  });

  it('should NOT trigger subscribe if new dimension is smaller than the current used', async () => {
    const wrapper = await shallowRender(defaultProps);
    expect(getFileState).toHaveBeenCalledTimes(1);

    wrapper.setProps({ apiConfig: { width: 90, height: 90 } });
    await wrapper.update();

    expect(getFileState).toHaveBeenCalledTimes(1);
  });

  it('should NOT trigger subscribe if new dimension is smaller than the current used', async () => {
    const wrapper = await shallowRender(defaultProps);
    expect(getFileState).toHaveBeenCalledTimes(1);

    wrapper.setProps({ identifier: defaultProps.identifier });
    await wrapper.update();

    expect(getFileState).toHaveBeenCalledTimes(1);
  });

  it('should trigger subscribe if new dimension is smaller than the current used', async () => {
    const wrapper = await shallowRender(defaultProps);
    expect(getFileState).toHaveBeenCalledTimes(1);

    wrapper.setProps({ apiConfig: { width: 110, height: 110 } });
    await wrapper.update();

    expect(getFileState).toHaveBeenCalledTimes(2);
  });

  it('should trigger subscribe if mediaClient has changed', async () => {
    const wrapper = await shallowRender(defaultProps);
    expect(getFileState).toHaveBeenCalledTimes(1);
    const dummyMediaClient = fakeMediaClient();
    asMock(dummyMediaClient.file.getFileState).mockImplementation(getFileState);
    asMock(dummyMediaClient.getImage).mockImplementation(getImage);

    wrapper.setProps({ mediaClient: dummyMediaClient });
    await wrapper.update();

    expect(getFileState).toHaveBeenCalledTimes(2);
  });

  it('should render preview image based on create object url output', async () => {
    const getFileState = jest.fn().mockReturnValue(
      Observable.of({
        status: 'processed',
        mediaType: 'image',
        preview: Promise.resolve(new Blob()),
      }),
    );
    const img = 'img.jpg';
    jest.spyOn(URL as any, 'createObjectURL').mockReturnValue(img);
    const getImage = jest.fn().mockReturnValue({});

    const mediaClient = fakeMediaClient();
    asMock(mediaClient.file.getFileState).mockImplementation(getFileState);
    asMock(mediaClient.getImage).mockImplementation(getImage);

    const props = {
      ...defaultProps,
      mediaClient,
    };
    const wrapper = await shallowRender(props);

    expect(getImage).toHaveBeenCalledTimes(0);
    expect(wrapper.find('img').props().src).toEqual(img);
  });

  it('should render preview image based on getImage output', async () => {
    const getFileState = jest
      .fn()
      .mockReturnValue(
        Observable.of({ status: 'processed', mediaType: 'image' }),
      );
    const img = 'img2.jpg';
    jest.spyOn(URL as any, 'createObjectURL').mockReturnValue(img);
    const getImage = jest
      .fn()
      .mockReturnValue(new Blob([img], { type: 'image/jpeg' }));

    const newMediaClient = fakeMediaClient();
    asMock(newMediaClient.file.getFileState).mockImplementation(getFileState);
    asMock(newMediaClient.getImage).mockImplementation(getImage);

    const props = {
      ...defaultProps,
      mediaClient: newMediaClient,
    };

    const wrapper = await shallowRender(props as MediaImageProps);

    expect(getImage).toHaveBeenCalledTimes(1);
    expect(wrapper.find('img').props().src).toEqual(img);
  });
});
