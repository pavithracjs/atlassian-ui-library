import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Context } from '@atlaskit/media-core';
import { withMediaClient, WithMediaClient } from '../../with-media-client-hoc';

const DummyComponent = (props: WithMediaClient) => null;

describe('withMediaClient', () => {
  it('should set context as mediaClient prop', () => {
    const Wrapper = withMediaClient(DummyComponent);
    const context = {} as Context;
    const component = mount(<Wrapper context={context} />);
    expect(
      component.find<WithMediaClient>(DummyComponent).props().mediaClient,
    ).toEqual(context);
  });
});
