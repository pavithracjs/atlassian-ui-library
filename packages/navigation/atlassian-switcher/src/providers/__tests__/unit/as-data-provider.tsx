import * as React from 'react';
import { mount } from 'enzyme';
import asDataProvider from '../../as-data-provider';
import { AnalyticsListener } from '@atlaskit/analytics-next';

const RESOLVED_VALUE = {};
const EXPECTED_ERROR_VALUE = 'ERROR';

describe('as-data-provider', () => {
  const childrenPropMock = jest.fn(() => null);

  afterEach(() => {
    childrenPropMock.mockClear();
  });

  it('should start from loading state then transition to complete', async () => {
    const resolvedPromise = Promise.resolve(RESOLVED_VALUE);

    const DataProvider = asDataProvider('test', () => resolvedPromise);

    mount(<DataProvider>{childrenPropMock}</DataProvider>);

    expect(childrenPropMock).toHaveBeenCalledTimes(1);
    expect(childrenPropMock).toHaveBeenLastCalledWith({
      data: null,
      status: 'loading',
    });

    await resolvedPromise;
    expect(childrenPropMock).toHaveBeenCalledTimes(2);
    expect(childrenPropMock).toHaveBeenLastCalledWith({
      data: RESOLVED_VALUE,
      status: 'complete',
    });
  });

  it('should start from complete state and update with fresh value', async () => {
    const CACHED_VALUE = 'CACHED';
    const resolvedPromise = Promise.resolve(RESOLVED_VALUE);

    const DataProvider = asDataProvider(
      'test',
      () => resolvedPromise,
      () => CACHED_VALUE,
    );

    mount(<DataProvider>{childrenPropMock}</DataProvider>);

    expect(childrenPropMock).toHaveBeenCalledTimes(1);
    expect(childrenPropMock).toHaveBeenLastCalledWith({
      data: CACHED_VALUE,
      status: 'complete',
    });

    await resolvedPromise;
    expect(childrenPropMock).toHaveBeenCalledTimes(2);
    expect(childrenPropMock).toHaveBeenLastCalledWith({
      data: RESOLVED_VALUE,
      status: 'complete',
    });
  });

  // Error state

  it('should start from complete state and NOT transition to error state', async () => {
    const CACHED_VALUE = 'CACHED';
    const rejectedPromise = Promise.reject(EXPECTED_ERROR_VALUE);

    const DataProvider = asDataProvider(
      'test',
      () => rejectedPromise,
      () => CACHED_VALUE,
    );

    mount(<DataProvider>{childrenPropMock}</DataProvider>);

    expect(childrenPropMock).toHaveBeenCalledTimes(1);
    expect(childrenPropMock).toHaveBeenLastCalledWith({
      data: CACHED_VALUE,
      status: 'complete',
    });

    try {
      await rejectedPromise;
    } catch (e) {}

    expect(childrenPropMock).toHaveBeenCalledTimes(1); // no subsequent call expected
  });

  it('should start from loading state then transition to error state', async () => {
    const rejectedPromise = Promise.reject(EXPECTED_ERROR_VALUE);

    const DataProvider = asDataProvider('test', () => rejectedPromise);
    mount(<DataProvider>{childrenPropMock}</DataProvider>);

    expect(childrenPropMock).toHaveBeenCalledTimes(1);
    expect(childrenPropMock).toHaveBeenLastCalledWith({
      data: null,
      status: 'loading',
    });

    try {
      await rejectedPromise;
    } catch (e) {}

    expect(childrenPropMock).toHaveBeenCalledTimes(2);
    expect(childrenPropMock).toHaveBeenLastCalledWith({
      data: null,
      status: 'error',
      error: EXPECTED_ERROR_VALUE,
    });
  });

  // Unmounted

  it('should not transition to a different anything if unmounted', async () => {
    const resolvedPromise = Promise.resolve(RESOLVED_VALUE);

    const DataProvider = asDataProvider('test', () => resolvedPromise);

    mount(<DataProvider>{childrenPropMock}</DataProvider>).unmount();

    expect(childrenPropMock).toHaveBeenCalledTimes(1);
    expect(childrenPropMock).toHaveBeenLastCalledWith({
      data: null,
      status: 'loading',
    });

    await resolvedPromise;
    expect(childrenPropMock).toHaveBeenCalledTimes(1);
  });

  // Events

  it('should fire receivedResult event', async () => {
    const onEvent = jest.fn();
    const resolvedPromise = Promise.resolve();

    const DataProvider = asDataProvider('test', () => resolvedPromise);

    mount(
      <AnalyticsListener onEvent={onEvent} channel="*">
        <DataProvider>{childrenPropMock}</DataProvider>
      </AnalyticsListener>,
    );

    await resolvedPromise;
    expect(onEvent).toHaveBeenCalledTimes(1);
    expect(onEvent.mock.calls[0][0]).toMatchObject({
      hasFired: true,
      payload: {
        action: 'receivedResult',
        actionSubject: 'atlassianSwitcherDataProvider',
        actionSubjectId: 'test',
        attributes: { outdated: false },
        eventType: 'operational',
      },
    });
  });

  it('should fire failed event', async () => {
    const onEvent = jest.fn();
    const rejectedPromise = Promise.reject();

    const DataProvider = asDataProvider('test', () => rejectedPromise);

    mount(
      <AnalyticsListener onEvent={onEvent} channel="*">
        <DataProvider>{childrenPropMock}</DataProvider>
      </AnalyticsListener>,
    );

    try {
      await rejectedPromise;
    } catch (e) {}

    expect(onEvent).toHaveBeenCalledTimes(1);
    expect(onEvent.mock.calls[0][0]).toMatchObject({
      hasFired: true,
      payload: {
        action: 'failed',
        actionSubject: 'atlassianSwitcherDataProvider',
        actionSubjectId: 'test',
        attributes: { outdated: false },
        eventType: 'operational',
      },
    });
  });

  it('should fire receivedResult event with outdated attribute', async () => {
    const onEvent = jest.fn();
    const resolvedPromise = Promise.resolve();

    const DataProvider = asDataProvider('test', () => resolvedPromise);

    mount(
      <AnalyticsListener onEvent={onEvent} channel="*">
        <DataProvider>{childrenPropMock}</DataProvider>
      </AnalyticsListener>,
    ).unmount();

    await resolvedPromise;
    expect(onEvent).toHaveBeenCalledTimes(1);
    expect(onEvent.mock.calls[0][0]).toMatchObject({
      hasFired: true,
      payload: {
        attributes: { outdated: true },
      },
    });
  });
});
