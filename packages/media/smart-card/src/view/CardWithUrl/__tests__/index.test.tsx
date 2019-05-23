jest.mock('react-lazily-render-scroll-parent', () => {
  return (data: any) => data.content;
});

jest.mock('react-transition-group/Transition', () => {
  return (data: any) => data.children;
});

import * as React from 'react';
import { CardWithUrlContent } from '../';
import { mount } from 'enzyme';
import { Client } from '../../../client';
import { ResolveResponse } from '../../../client/types';
import Button from '@atlaskit/button';
import {
  AnalyticsEventPayload,
  UIAnalyticsEventInterface,
} from '@atlaskit/analytics-next';
import {
  InlineCardUnauthorizedView,
  InlineCardResolvedView,
  InlineCardForbiddenView,
} from '@atlaskit/media-ui';
import { Frame } from '@atlaskit/media-ui/src/InlineCard/Frame';

class FakeUnresolvedClient extends Client {
  fetchData(): Promise<ResolveResponse> {
    return Promise.resolve({
      meta: {
        visibility: 'restricted',
        access: 'unauthorized',
        auth: [
          {
            key: 'string',
            displayName: 'string',
            url: 'string',
          },
        ],
        definitionId: 'd1',
      },
    } as ResolveResponse);
  }
}

class FakeForbiddenClient extends Client {
  fetchData(): Promise<ResolveResponse> {
    return Promise.resolve({
      meta: {
        visibility: 'restricted',
        access: 'forbidden',
        auth: [
          {
            key: 'string',
            displayName: 'string',
            url: 'string',
          },
        ],
        definitionId: 'd1',
      },
    } as ResolveResponse);
  }
}

class FakeResolvedClient extends Client {
  fetchData(): Promise<ResolveResponse> {
    return Promise.resolve({
      meta: {
        visibility: 'public',
        access: 'granted',
        auth: [
          {
            key: 'string',
            displayName: 'string',
            url: 'string',
          },
        ],
        definitionId: 'd1',
      },
    } as ResolveResponse);
  }
}

const Mock = {
  positiveAuthFn: () => Promise.resolve(),
  negativeAuthFn: () => Promise.reject(new Error('rejected auth')),
  winClosedAuthFn: () =>
    Promise.reject(new Error('The auth window was closed')),
  mockedFireFn: jest.fn(),
  fakeCreateAnalyticsEvent: jest.fn().mockImplementation(
    (payload: AnalyticsEventPayload): UIAnalyticsEventInterface => {
      return ({
        fire: Mock.mockedFireFn,
        payload,
      } as any) as UIAnalyticsEventInterface;
    },
  ),
};

const delay = (n: number) => new Promise(res => setTimeout(res, n));

describe('Card with URL analytics', () => {
  describe('Render Card With URL (Unresolved)', () => {
    afterEach(() => {
      Mock.fakeCreateAnalyticsEvent.mockClear();
    });

    it('should fire connectSucceeded event when auth suceeds', async () => {
      const fakeClient = new FakeUnresolvedClient({ loadingStateDelay: 0 });
      const wrapper = mount(
        <CardWithUrlContent
          url="http://some.url"
          client={fakeClient}
          appearance="inline"
          onClick={() => {}}
          isSelected={false}
          createAnalyticsEvent={Mock.fakeCreateAnalyticsEvent}
          authFn={Mock.positiveAuthFn}
        />,
      );
      // pending state for now...
      await delay(1); // wait for client to respond...
      wrapper.update();

      wrapper
        .find(InlineCardUnauthorizedView)
        .find(Button)
        .simulate('click');

      await delay(1); // wait for async auth mock...

      const calls = Mock.fakeCreateAnalyticsEvent.mock.calls.map(([obj]) =>
        obj.action && obj.eventType !== 'screen' ? obj.action : 'screen',
      );

      expect(calls).toEqual([
        'unresolved',
        'clicked',
        'screen',
        'connected',
        'connectSucceeded',
      ]);
    });

    it('should fire connectFailed event when auth fails', async () => {
      const fakeClient = new FakeUnresolvedClient({ loadingStateDelay: 0 });
      const wrapper = mount(
        <CardWithUrlContent
          url="http://some.url"
          client={fakeClient}
          appearance="inline"
          onClick={() => {}}
          isSelected={false}
          createAnalyticsEvent={Mock.fakeCreateAnalyticsEvent}
          authFn={Mock.negativeAuthFn}
        />,
      );
      // pending state for now...
      await delay(1); // wait for client to respond...
      wrapper.update();

      wrapper
        .find(InlineCardUnauthorizedView)
        .find(Button)
        .simulate('click');

      await delay(1); // wait for async auth mock...

      const calls = Mock.fakeCreateAnalyticsEvent.mock.calls.map(([obj]) =>
        obj.action && obj.eventType !== 'screen' ? obj.action : 'screen',
      );

      expect(calls).toEqual([
        'unresolved',
        'clicked',
        'screen',
        'connectFailed',
      ]);
    });

    it('should track the reason for auth failure', async () => {
      const fakeClient = new FakeUnresolvedClient({ loadingStateDelay: 0 });
      const wrapper = mount(
        <CardWithUrlContent
          url="http://some.url"
          client={fakeClient}
          appearance="inline"
          onClick={() => {}}
          isSelected={false}
          createAnalyticsEvent={Mock.fakeCreateAnalyticsEvent}
          authFn={Mock.negativeAuthFn}
        />,
      );
      // pending state for now...
      await delay(1); // wait for client to respond...
      wrapper.update();

      wrapper
        .find(InlineCardUnauthorizedView)
        .find(Button)
        .simulate('click');

      await delay(1); // wait for async auth mock...

      const reasons = Mock.fakeCreateAnalyticsEvent.mock.calls.map(([obj]) =>
        obj.eventType === 'operational' ? obj.attributes.reason : 'none',
      );
      expect(reasons.filter(x => x !== 'none')).toEqual([
        'unauthorized',
        'potentialSensitiveData',
      ]);
    });

    it('should track when auth dialog was closed', async () => {
      const fakeClient = new FakeUnresolvedClient({ loadingStateDelay: 0 });
      const wrapper = mount(
        <CardWithUrlContent
          url="http://some.url"
          client={fakeClient}
          appearance="inline"
          onClick={() => {}}
          isSelected={false}
          createAnalyticsEvent={Mock.fakeCreateAnalyticsEvent}
          authFn={Mock.winClosedAuthFn}
        />,
      );
      // pending state for now...
      await delay(1); // wait for client to respond...
      wrapper.update();

      wrapper
        .find(InlineCardUnauthorizedView)
        .find(Button)
        .simulate('click');

      await delay(1); // wait for async auth mock...

      const reasons = Mock.fakeCreateAnalyticsEvent.mock.calls.map(([obj]) =>
        obj.eventType === 'operational' ? obj.attributes.reason : 'none',
      );
      expect(reasons.filter(x => x !== 'none')).toEqual([
        'unauthorized',
        'authWindowClosed',
      ]);
    });
  });

  describe('Render Card With URL (Resolved)', () => {
    afterEach(() => {
      Mock.fakeCreateAnalyticsEvent.mockClear();
    });
    it('fires an analytics ui event when a resolved link is clicked', async () => {
      const fakeClient = new FakeResolvedClient({ loadingStateDelay: 0 });
      const wrapper = mount(
        <CardWithUrlContent
          url="http://some.url"
          client={fakeClient}
          appearance="inline"
          onClick={() => {}}
          isSelected={false}
          createAnalyticsEvent={Mock.fakeCreateAnalyticsEvent}
          authFn={Mock.positiveAuthFn}
        />,
      );
      // pending state for now...
      await delay(1); // wait for client to respond...
      wrapper.update();

      wrapper
        .find(InlineCardResolvedView)
        .find(Frame)
        .simulate('click');

      await delay(1); // wait for async auth mock...

      const calls = Mock.fakeCreateAnalyticsEvent.mock.calls.map(([obj]) =>
        obj.action && obj.eventType === 'ui' ? obj.action : 'none',
      );

      expect(calls.filter(x => x !== 'none')).toEqual(['clicked']);
    });
  });

  describe('Render Card With URL (Forbidden)', () => {
    afterEach(() => {
      Mock.fakeCreateAnalyticsEvent.mockClear();
    });

    it('should fire analytics events when attempting to connect with an alternate account suceeds', async () => {
      const fakeClient = new FakeForbiddenClient({ loadingStateDelay: 0 });
      const wrapper = mount(
        <CardWithUrlContent
          url="http://some.url"
          client={fakeClient}
          appearance="inline"
          onClick={() => {}}
          isSelected={false}
          createAnalyticsEvent={Mock.fakeCreateAnalyticsEvent}
          authFn={Mock.positiveAuthFn}
        />,
      );
      // pending state for now...
      await delay(1); // wait for client to respond...
      wrapper.update();

      wrapper
        .find(InlineCardForbiddenView)
        .find(Frame)
        .find(Button)
        .simulate('click');

      await delay(1); // wait for async auth mock...

      const calls = Mock.fakeCreateAnalyticsEvent.mock.calls.map(([obj]) =>
        obj.action && obj.eventType !== 'screen' ? obj.action : 'screen',
      );

      expect(calls).toEqual([
        'unresolved',
        'clicked',
        'screen',
        'connected',
        'connectSucceeded',
      ]);
    });

    it('fires an analytics ui event when a forbidden link is clicked', async () => {
      const fakeClient = new FakeForbiddenClient({ loadingStateDelay: 0 });
      const wrapper = mount(
        <CardWithUrlContent
          url="http://some.url"
          client={fakeClient}
          appearance="inline"
          onClick={() => {}}
          isSelected={false}
          createAnalyticsEvent={Mock.fakeCreateAnalyticsEvent}
          authFn={Mock.positiveAuthFn}
        />,
      );
      // pending state for now...
      await delay(1); // wait for client to respond...
      wrapper.update();

      wrapper
        .find(InlineCardForbiddenView)
        .find(Frame)
        .find(Button)
        .simulate('click');

      await delay(1); // wait for async auth mock...

      const calls = Mock.fakeCreateAnalyticsEvent.mock.calls.map(([obj]) =>
        obj.action && obj.eventType === 'ui' ? obj.actionSubjectId : 'none',
      );

      expect(calls.filter(x => x !== 'none')).toEqual(['tryAnotherAccount']);
    });

    it('should track the reason for auth failure when attempting to connect with a different account', async () => {
      const fakeClient = new FakeForbiddenClient({ loadingStateDelay: 0 });
      const wrapper = mount(
        <CardWithUrlContent
          url="http://some.url"
          client={fakeClient}
          appearance="inline"
          onClick={() => {}}
          isSelected={false}
          createAnalyticsEvent={Mock.fakeCreateAnalyticsEvent}
          authFn={Mock.negativeAuthFn}
        />,
      );
      // pending state for now...
      await delay(1); // wait for client to respond...
      wrapper.update();

      wrapper
        .find(InlineCardForbiddenView)
        .find(Frame)
        .find(Button)
        .simulate('click');

      await delay(1); // wait for async auth mock...

      const reasons = Mock.fakeCreateAnalyticsEvent.mock.calls.map(([obj]) =>
        obj.eventType === 'operational' ? obj.attributes.reason : 'none',
      );
      expect(reasons.filter(x => x !== 'none')).toEqual([
        'forbidden',
        'potentialSensitiveData',
      ]);
    });
  });
});
