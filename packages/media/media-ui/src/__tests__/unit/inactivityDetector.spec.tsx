import * as React from 'react';
import { shallow } from 'enzyme';
import { InactivityDetector, WithShowControlMethodProp } from '../..';
import {
  asMock,
  expectFunctionToHaveBeenCalledWith,
} from '@atlaskit/media-test-helpers';
import { InactivityDetectorWrapper } from '../../inactivityDetector/styled';

class DummyChild extends React.Component<WithShowControlMethodProp> {
  render() {
    return null;
  }
}

describe('InactivityDetector', () => {
  const setup = () => {
    const showControlsRegister = jest.fn();
    const component = shallow(
      <InactivityDetector
        triggerActivityCallbackRequester={showControlsRegister}
      >
        <DummyChild />
      </InactivityDetector>,
    );

    return {
      component,
      showControlsRegister,
    };
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should render children', () => {
    const { component } = setup();
    expect(component.find(DummyChild)).toBeDefined();
  });

  it('should call showControlsRegister with showControl callback', () => {
    const { showControlsRegister } = setup();
    expectFunctionToHaveBeenCalledWith(showControlsRegister, [
      expect.any(Function),
    ]);
  });

  it('should give moseMovement resetting function as part of showControlsRegister call', () => {
    const { showControlsRegister, component } = setup();
    const activityActivationFunction = showControlsRegister.mock.calls[0][0];

    // Controls are visible in the beginning
    expect(component.state('showControls')).toBeTruthy();
    // User waits
    jest.runOnlyPendingTimers();
    // Controls should disappear now.
    expect(component.state('showControls')).toBeFalsy();
    // One of the child components calls given function
    activityActivationFunction();
    // Controls should be visible again
    expect(component.state('showControls')).toBeTruthy();
  });

  it('should handle mouse move', () => {
    const { component } = setup();

    expect(component.state('showControls')).toBeTruthy();
    component.find(InactivityDetectorWrapper).simulate('mouseMove');
    jest.runOnlyPendingTimers();
    expect(component.state('showControls')).toBeFalsy();
  });

  it('should keep controls visible when user is hovering them', () => {
    const { component } = setup();
    const elementWithControls = document.createElement('div');

    elementWithControls.classList.add('mvng-hide-controls');
    component.find(InactivityDetectorWrapper).simulate('mouseMove', {
      target: elementWithControls,
    });
    jest.runOnlyPendingTimers();
    expect(component.state('showControls')).toBeTruthy();
  });

  it('should start with controls visible', () => {
    const { component } = setup();

    expect(
      component.find(InactivityDetectorWrapper).prop('showControls'),
    ).toBeTruthy();
  });

  it('should clear the timeout when component gets unmounted', () => {
    const { component } = setup();
    const callsNumber = asMock(clearTimeout).mock.calls.length;
    jest.runOnlyPendingTimers();
    component.unmount();
    expect(clearTimeout).toHaveBeenCalledTimes(callsNumber + 1);
  });
});
