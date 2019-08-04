import * as React from 'react';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';
import { noop } from '@babel/types';
import Button from '@atlaskit/button';
import MentionSpotlight, { Props } from '../../../components/MentionSpotlight';
import * as SpotlightAnalytics from '../../../util/analytics';

function render(props: Partial<Props>) {
  return mountWithIntl(
    <MentionSpotlight
      createTeamLink="somelink"
      onClose={() => noop}
      {...props}
    />,
  );
}

let mockRegisterRender = jest.fn();
let mockRegisterCreateLinkClick = jest.fn();
let mockGetSeenCount = jest.fn();
let mockFireAnalyticsSpotlightMentionEvent = jest.fn();
let mockIsSpotlightEnabled = true;

mockGetSeenCount.mockReturnValue('testValue');

jest.mock(
  '../../../components/MentionSpotlight/MentionSpotlightController',
  () => ({
    __esModule: true,
    default: {
      registerRender: () => mockRegisterRender(),
      registerCreateLinkClick: () => mockRegisterCreateLinkClick(),
      getSeenCount: () => mockGetSeenCount(),
      isSpotlightEnabled: () => mockIsSpotlightEnabled,
    },
  }),
);

jest.mock('../../../util/analytics', () => {
  const mockActualAnalytics = require.requireActual('../../../util/analytics');

  return {
    Actions: mockActualAnalytics.Actions,
    ComponentNames: mockActualAnalytics.ComponentNames,
    fireAnalyticsSpotlightMentionEvent: () =>
      mockFireAnalyticsSpotlightMentionEvent,
  };
});

describe('MentionSpotlight', () => {
  beforeEach(() => {
    mockIsSpotlightEnabled = true;
    mockRegisterRender.mockReset();
  });

  // Because we manually bind events, we need to fire events and test outside of React
  it('Should register closed on button click', () => {
    const onClose = jest.fn();
    const spotlight = render({ onClose: onClose });

    const closeButton = spotlight.find('button').getDOMNode();

    // make sure the click event is able to bubble
    const event = new Event('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    closeButton.dispatchEvent(event);

    expect(onClose).toHaveBeenCalled();
  });

  it('Should register render on mount', () => {
    render({});
    expect(mockRegisterRender).toHaveBeenCalled();
  });

  it('should not call registerRender if Spotlight Controller asked not to render spotlight', () => {
    mockIsSpotlightEnabled = false;
    render({});
    expect(mockRegisterRender).toHaveBeenCalledTimes(0);
  });

  // Because we manually bind events, we need to fire events and test outside of React
  it('Should register link on click', () => {
    const spotlight = render({});
    const link = spotlight.find('a').getDOMNode();
    mockRegisterCreateLinkClick.mockReset();

    // mockRegisterCreateLinkClick = jest.fn();

    // make sure the click event is able to bubble
    const event = new Event('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    link.dispatchEvent(event);

    expect(mockRegisterCreateLinkClick).toHaveBeenCalled();
  });

  it('should not show the highlight if the spotlight has been closed by the user', () => {
    const spotlight = render({ onClose: jest.fn() });
    expect(spotlight.html()).not.toBeNull();

    const closeButton = spotlight.find('button').getDOMNode();
    // make sure the click event is able to bubble
    const event = new Event('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    closeButton.dispatchEvent(event);

    expect(spotlight.html()).toBeNull();
  });

  it('should send analytics data if the spotlight has been closed by the user', () => {
    const spotlight = render({ onClose: jest.fn() });
    expect(spotlight.html()).not.toBeNull();
    spotlight.find(Button).simulate('click');
    expect(mockFireAnalyticsSpotlightMentionEvent).toHaveBeenCalledWith(
      SpotlightAnalytics.ComponentNames.SPOTLIGHT,
      SpotlightAnalytics.Actions.CLOSED,
      SpotlightAnalytics.ComponentNames.MENTION,
      'closeButton',
    );
  });

  it('should send analytics data if user clicks on spotlight link', () => {
    const spotlight = render({ onClose: jest.fn() });
    expect(spotlight.html()).not.toBeNull();
    spotlight.find('a').simulate('click');
    expect(mockFireAnalyticsSpotlightMentionEvent).toHaveBeenCalledWith(
      SpotlightAnalytics.ComponentNames.SPOTLIGHT,
      SpotlightAnalytics.Actions.CLICKED,
      SpotlightAnalytics.ComponentNames.MENTION,
      'createTeamLink',
    );
  });

  it('should send analytics data if the spotlight has been displayed', () => {
    mockRegisterRender = jest.fn();
    mockGetSeenCount = jest.fn();
    render({ onClose: jest.fn() });

    expect(mockRegisterRender).toHaveBeenCalledTimes(1);
    expect(mockGetSeenCount).toHaveBeenCalledTimes(1);

    expect(mockFireAnalyticsSpotlightMentionEvent).toHaveBeenCalledWith(
      SpotlightAnalytics.ComponentNames.SPOTLIGHT,
      SpotlightAnalytics.Actions.VIEWED,
      SpotlightAnalytics.ComponentNames.MENTION,
      undefined,
      'testValue',
    );
  });

  it('should not show spotlight after re-render if the Spotlight Controller asked not to render it at the first mount', () => {
    mockIsSpotlightEnabled = false;
    const spotlight = render({});

    expect(spotlight.html()).toBeNull();

    // after first render, ask controller to show it
    mockIsSpotlightEnabled = true;

    //should still hide the spotlight after re-render
    spotlight.render();
    expect(spotlight.html()).toBeNull();
  });

  it('should show spotlight after re-render if the Spotlight Controller asked to render it at the first mount', () => {
    const spotlight = render({});

    // Should render in the first time
    expect(spotlight.html()).not.toBeNull();

    //after first render, ask controller to hide it
    mockIsSpotlightEnabled = false;

    //should still show the spotlight after re-render
    spotlight.render();
    expect(spotlight.html()).not.toBeNull();
  });
});
