import * as React from 'react';
import { mount } from 'enzyme';

jest.mock('../../../service/newUploadServiceImpl');
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
    const spy = jest.spyOn((instance as any).uploadService, 'addFiles');
    browser.find('input').simulate('change');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith([]);
  });

  it('should provide a function to onBrowseFn callback property and call click function on native input element', () => {
    const onBrowseFnSpy = jest.fn();
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={browseConfig}
        onBrowseFn={onBrowseFnSpy}
      />,
    );
    const instance = browser.instance() as Browser;
    const spy = jest.spyOn((instance as any).browserRef.current, 'click');
    expect(onBrowseFnSpy).toBeCalled();
    onBrowseFnSpy.mock.calls[0][0]();
    expect(spy).toBeCalled();
  });

  it('should provide a function to onCancelFn callback property and call uploadService.cancel', () => {
    const onCancelFnSpy = jest.fn();
    const browser = mount(
      <Browser
        mediaClient={mediaClient}
        config={browseConfig}
        onCancelFn={onCancelFnSpy}
      />,
    );
    const instance = browser.instance() as Browser;
    expect(onCancelFnSpy).toBeCalled();
    onCancelFnSpy.mock.calls[0][0]();
    expect((instance as any).uploadService.cancel).toBeCalled();
  });
});
