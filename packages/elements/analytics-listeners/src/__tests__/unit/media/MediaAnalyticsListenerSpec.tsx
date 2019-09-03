import {
  DEFAULT_SOURCE,
  GasPayload,
  UI_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import {
  AnalyticsListener,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next';
import { mount } from 'enzyme';
import * as React from 'react';
import { createButtonWithAnalytics } from '../../../../examples/helpers';
import Logger from '../../../helpers/logger';
import MediaAnalyticsListener from '../../../media/MediaAnalyticsListener';
import { AnalyticsWebClient, FabricChannel } from '../../../types';
import { createLoggerMock } from '../../_testUtils';

describe('MediaAnalyticsListener', () => {
  let analyticsWebClientMock: AnalyticsWebClient;
  let loggerMock: Logger;

  beforeEach(() => {
    analyticsWebClientMock = {
      sendUIEvent: jest.fn(),
      sendOperationalEvent: jest.fn(),
      sendTrackEvent: jest.fn(),
      sendScreenEvent: jest.fn(),
    };
    loggerMock = createLoggerMock();
  });

  const fireAndVerify = (
    eventPayload: GasPayload,
    expectedEvent: any,
    context?: AnalyticsEventPayload[],
  ) => {
    const spy = jest.fn();
    const ButtonWithAnalytics = createButtonWithAnalytics(
      eventPayload,
      FabricChannel.media,
      context,
    );

    const component = mount(
      <MediaAnalyticsListener
        client={analyticsWebClientMock}
        logger={loggerMock}
      >
        <ButtonWithAnalytics onClick={spy} />
      </MediaAnalyticsListener>,
    );
    component.find(ButtonWithAnalytics).simulate('click');

    expect(analyticsWebClientMock.sendUIEvent).toBeCalledWith(expectedEvent);
  };

  it('should register an Analytics listener on the media channel', () => {
    const component = mount(
      <MediaAnalyticsListener
        client={analyticsWebClientMock}
        logger={loggerMock}
      >
        <div />
      </MediaAnalyticsListener>,
    );

    const analyticsListener = component.find(AnalyticsListener);
    expect(analyticsListener.props()).toHaveProperty(
      'channel',
      FabricChannel.media,
    );
  });

  it('should send event with default source', () => {
    fireAndVerify(
      {
        eventType: UI_EVENT_TYPE,
        action: 'someAction',
        actionSubject: 'someComponent',
      },
      {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: DEFAULT_SOURCE,
        tags: expect.arrayContaining(['media']),
      },
    );
  });

  it('should keep original source if set', () => {
    fireAndVerify(
      {
        eventType: UI_EVENT_TYPE,
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'mySource',
      },
      {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'mySource',
        tags: expect.arrayContaining(['media']),
      },
    );
  });

  it('should append media tag if tags are not empty', () => {
    fireAndVerify(
      {
        eventType: UI_EVENT_TYPE,
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'mySource',
        tags: ['atlaskit'],
      },
      {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'mySource',
        tags: expect.arrayContaining(['media']),
      },
    );
  });

  it('should not remove any existing tags if tags are not empty', () => {
    fireAndVerify(
      {
        eventType: UI_EVENT_TYPE,
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'mySource',
        tags: ['atlaskit'],
      },
      {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'mySource',
        tags: expect.arrayContaining(['media', 'atlaskit']),
      },
    );
  });

  it('should include package hierarchy based on context data', () => {
    const context = [
      { packageName: '@someNice/Package', packageVersion: '3.4.5' }, // Top Package
      { packageName: 'anotherNice', packageVersion: 33 }, // Middle Packages
      { packageName: 'notNicePackage' },
      { willThis: 'pass??' },
      { packageName: '@peter/framptom', packageVersion: 'babyILoveYourWay' }, // Bottom Package
    ];
    fireAndVerify(
      {
        eventType: UI_EVENT_TYPE,
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'mySource',
        tags: ['atlaskit'],
      },
      {
        action: 'someAction',
        actionSubject: 'someComponent',
        source: 'mySource',
        tags: expect.arrayContaining(['media', 'atlaskit']),
        attributes: {
          packageHierarchy:
            '@someNice/Package@3.4.5,anotherNice@33,notNicePackage,@peter/framptom@babyILoveYourWay',
        },
      },
      context,
    );
  });

  it('should merge event payload with context hierarchy having the same attributes.packageName', () => {
    const topContextData = {
      val1: 'overriden by payload',
      val2: 'overriden by bottom context',
      val4: 'topContext val4',
      attributes: {
        attr1: 'overriden by payload',
        attr2: 'overriden by bottom context',
        attr4: 'topContext attr4',
        packageName: '@anAwesome/Package',
      },
      tags: ['top-tag-1', 'top-tag-2'],
    };
    const middleContextData = {
      val7: 'nope',
      val8: 'nope',
      val9: 'nope',
      attributes: {
        attr7: 'nope',
        attr8: 'nope',
        attr9: 'nope',
        packageName: '@different/Package',
      },
      tags: ['middle-tag-1', 'middle-tag-2'],
    };
    const bottomContextData = {
      val2: 'bottomContext val2',
      val3: 'overriden by payload',
      attributes: {
        attr2: 'bottomContext attr2',
        attr3: 'overriden by payload',
        packageName: '@anAwesome/Package',
      },
      tags: ['bottom-tag-1'],
    };

    const context = [topContextData, middleContextData, bottomContextData];

    const eventPayload: GasPayload = {
      eventType: UI_EVENT_TYPE,
      actionSubject: 'someComponent',
      val1: 'payload val1',
      val3: 'payload val3',
      attributes: {
        attr1: 'payload attr1',
        attr3: 'payload attr3',
        packageName: '@anAwesome/Package',
      },
      tags: ['payload-tag-1', 'payload-tag-2'],
    };

    const expectedMergedPayloadWithContexts = {
      actionSubject: 'someComponent',
      val1: 'payload val1',
      val2: 'bottomContext val2',
      val3: 'payload val3',
      val4: 'topContext val4',
      attributes: {
        attr1: 'payload attr1',
        attr2: 'bottomContext attr2',
        attr3: 'payload attr3',
        attr4: 'topContext attr4',
        packageName: '@anAwesome/Package',
      },
      source: 'unknown',
      tags: [
        'payload-tag-1',
        'payload-tag-2',
        'bottom-tag-1',
        'top-tag-1',
        'top-tag-2',
        'media',
      ],
    };
    fireAndVerify(eventPayload, expectedMergedPayloadWithContexts, context);
  });
});
