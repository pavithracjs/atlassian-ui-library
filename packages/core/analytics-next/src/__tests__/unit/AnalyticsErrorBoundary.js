// @flow

import React from 'react';
import { mount } from 'enzyme';
import { BaseAnalyticsErrorBoundary as AnalyticsErrorBoundary } from '../../AnalyticsErrorBoundary';
import UIAnalyticsEvent from '../../UIAnalyticsEvent';

const createAnalyticsEvent = jest.fn();
const props = {
  channel: 'atlaskit',
  componentName: 'button',
  packageName: '@atlaskit/button',
  componentVersion: '999.9.9',
  createAnalyticsEvent,
};

describe('AnalyticsErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render the child component', () => {
    const wrapper = mount(
      <AnalyticsErrorBoundary {...props}>
        <div className="child-component" />
      </AnalyticsErrorBoundary>,
    );

    expect(wrapper.find('.child-component')).toHaveLength(1);
  });

  it('should fire an analytics event if error has been triggered in one of the children components', () => {
    const analyticsEvent = new UIAnalyticsEvent({
      context: [],
      handlers: [],
      payload: {
        action: 'click',
        a: { b: 'c' },
      },
    });

    jest.spyOn(analyticsEvent, 'fire');

    createAnalyticsEvent.mockImplementation(() => {
      return analyticsEvent;
    });

    const error = new Error('Error');
    const Something = (p: { error: boolean }) => {
      if (p.error) {
        throw error;
      }
      // this is just a placeholder
      return <div className="child-component" />;
    };

    expect(() => {
      mount(
        <AnalyticsErrorBoundary
          {...props}
          createAnalyticsEvent={createAnalyticsEvent}
        >
          <Something error />
        </AnalyticsErrorBoundary>,
      );
    }).toThrow();

    expect(createAnalyticsEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        action: 'UnhandledError',
        attributes: expect.objectContaining({
          browserInfo: expect.any(String),
          componentName: 'button',
          componentVersion: '999.9.9',
          error,
          info: expect.objectContaining({
            componentStack: expect.any(String),
          }),
          packageName: '@atlaskit/button',
        }),
        eventType: 'ui',
      }),
    );
    expect(analyticsEvent.fire).toHaveBeenNthCalledWith(1, 'atlaskit');
  });
});
