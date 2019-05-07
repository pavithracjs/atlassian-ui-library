import * as React from 'react';
import { mount } from 'enzyme';

jest.mock('../../../service/newUploadServiceImpl');

import { ContextFactory } from '@atlaskit/media-core';
import { Browser } from '../../browserReact';

describe('Browser', () => {
  const setup = () => {
    const context = ContextFactory.create({
      authProvider: {} as any,
    });
    const browseConfig = {
      uploadParams: {},
    };
    const browser = mount(<Browser context={context} config={browseConfig} />);

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
