import * as React from 'react';
import { mount } from 'enzyme';

jest.mock('../../../service/newUploadServiceImpl');
import { fakeMediaClient } from '@atlaskit/media-test-helpers';
import { Browser } from '../../browser/browser';

describe('Browser', () => {
  const setup = () => {
    const mediaClient = fakeMediaClient();
    const browseConfig = {
      uploadParams: {},
    };
    const browser = mount(
      <Browser mediaClient={mediaClient} config={browseConfig} />,
    );

    return {
      browser,
    };
  };

  it('should add upload files when user picks some', () => {
    const { browser } = setup();
    const instance = browser.instance() as Browser;
    const spy = jest.spyOn((instance as any).uploadService, 'addFiles');
    browser.find('input').simulate('change');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith([]);
  });
});
