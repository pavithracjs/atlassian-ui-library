import * as React from 'react';
import { mount } from 'enzyme';
import { Context, MediaClientConfig } from '@atlaskit/media-core';
import { withMediaClient, WithMediaClient } from '../../with-media-client-hoc';

class DummyComponent extends React.Component<WithMediaClient, {}> {
  render() {
    return null;
  }
}

describe('withMediaClient', () => {
  it('should set context as mediaClient prop', () => {
    const Wrapper = withMediaClient(DummyComponent);
    const context = {} as Context;
    const component = mount(<Wrapper context={context} />);
    expect(
      component.find<WithMediaClient>(DummyComponent).props().mediaClient,
    ).toEqual(context);
  });

  it('should create new mediaClient from given mediaClientConfig', () => {
    const Wrapper = withMediaClient(DummyComponent);
    const mediaClientConfig: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url',
          clientId: 'client-id',
          token: 'token',
        }),
    };
    const component = mount(<Wrapper mediaClientConfig={mediaClientConfig} />);
    const mediaClient = component.find<WithMediaClient>(DummyComponent).props()
      .mediaClient;
    expect(mediaClient).not.toBeUndefined();
    expect(mediaClient.config).toEqual(mediaClientConfig);
  });

  it('should reuse previously created mediaClient instance for same mediaClientConfig', () => {
    const Wrapper = withMediaClient(DummyComponent);
    const mediaClientConfig: MediaClientConfig = {
      authProvider: () =>
        Promise.resolve({
          baseUrl: 'url',
          clientId: 'client-id',
          token: 'token',
        }),
    };
    const component1 = mount(<Wrapper mediaClientConfig={mediaClientConfig} />);
    const component2 = mount(<Wrapper mediaClientConfig={mediaClientConfig} />);
    const mediaClient1 = component1
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;
    const mediaClient2 = component2
      .find<WithMediaClient>(DummyComponent)
      .props().mediaClient;
    expect(mediaClient1).toBe(mediaClient2);
  });
});
