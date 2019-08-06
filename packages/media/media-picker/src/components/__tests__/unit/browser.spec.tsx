import * as React from 'react';
import { mount } from 'enzyme';

jest.mock('../../../service/uploadServiceImpl');
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import { Browser } from '../../browser/browser';

describe('Browser', () => {
  const mediaClient = fakeMediaClient();
  const browseConfig = {
    uploadParams: {},
  };

  it('should add upload files when user picks some', () => {
    const browser = mount(
      <Browser mediaClient={mediaClient} config={browseConfig} />,
    );
    const instance = browser.instance() as Browser;
    const addFilesSpy = jest.spyOn((instance as any).uploadService, 'addFiles');
    browser.find('input').simulate('change');

    expect(addFilesSpy).toHaveBeenCalledTimes(1);
    expect(addFilesSpy).toBeCalledWith([]);
  });

  it('should provide a function to onBrowseFn callback property and call click function on native input element', () => {
    const onBrowseFnMock = jest.fn();
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={browseConfig}
        onBrowseFn={onBrowseFnMock}
      />,
    );
    const instance = browser.instance() as Browser;
    const clickSpy = jest.spyOn((instance as any).browserRef.current, 'click');
    expect(onBrowseFnMock).toBeCalled();
    onBrowseFnMock.mock.calls[0][0]();
    expect(clickSpy).toBeCalled();
  });

  it('should provide a function to onCancelFn callback property and call uploadService.cancel', () => {
    const onCancelFnMock = jest.fn();
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={browseConfig}
        onCancelFn={onCancelFnMock}
      />,
    );
    const instance = browser.instance() as Browser;
    expect(onCancelFnMock).toBeCalled();
    onCancelFnMock.mock.calls[0][0]();
    expect((instance as any).uploadService.cancel).toBeCalled();
  });
});
