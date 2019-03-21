import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import AtlassianSwitcher from '../../components/atlassian-switcher';
import Item from '@atlaskit/item';
import ManageButton from '../../primitives/manage-button';
import { IntlProvider } from 'react-intl';
import '../../../test-helpers/mock-fetch';
import createStream, { Stream } from '../../../test-helpers/stream';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  UIAnalyticsEventInterface,
  ObjectType,
} from '@atlaskit/analytics-next-types/index';

const DefaultAtlassianSwitcher = (props: any = {}) => (
  <IntlProvider locale="en">
    <AnalyticsListener channel="*" onEvent={props.onEventFired}>
      <AtlassianSwitcher
        product="jira"
        cloudId="some-cloud-id"
        triggerXFlow={() => 'triggering xflow'}
        {...props}
      />
    </AnalyticsListener>
  </IntlProvider>
);

const flattenContext = (context: ObjectType[]) =>
  context.reduce(
    (flattenedContext, contextLayer) =>
      contextLayer.navigationCtx && contextLayer.navigationCtx.attributes
        ? {
            ...flattenedContext,
            ...contextLayer.navigationCtx.attributes,
          }
        : flattenedContext,
    {},
  );

describe('Atlassian Switcher - Component Analytics', () => {
  let wrapper: ReactWrapper;
  let eventStream: Stream<UIAnalyticsEventInterface>;
  beforeEach(() => {
    eventStream = createStream();
    wrapper = mount(<DefaultAtlassianSwitcher onEventFired={eventStream} />);
  });
  it('should fire "atlassianSwitcher rendered"', done => {
    eventStream.next().then(({ payload }) => {
      expect(payload).toMatchObject({
        eventType: 'operational',
        action: 'rendered',
        actionSubject: 'atlassianSwitcher',
      });
      expect(payload.attributes).toHaveProperty('duration');
      expect(payload.attributes.duration).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('should fire "atlassianSwitcherItem clicked"', done => {
    eventStream
      .skip(1)
      .then(() => {
        const item = wrapper.find(Item);
        item.at(0).simulate('click');
        return eventStream.next();
      })
      .then(({ payload, context }) => {
        expect(payload).toMatchObject({
          eventType: 'ui',
          action: 'clicked',
          actionSubject: 'atlassianSwitcherItem',
        });
        expect(flattenContext(context)).toMatchObject({
          group: 'switchTo',
          itemType: 'product',
          itemId: 'jira',
        });
        done();
      });
  });

  it('should fire "button clicked - manageListButton"', done => {
    eventStream
      .skip(1)
      .then(() => {
        /*
          This is needed as there's a slight delay between the rendered event being fired 
          and the last endpoint being proccessed. This can be removed once we instrument 
          the data providers with analytics and we intentionally skip the events triggered 
          by the fetch calls.
         */
        process.nextTick(() => {
          wrapper.update();
          const manageButton = wrapper.find(ManageButton);
          manageButton.simulate('click');
        });
        return eventStream.next();
      })
      .then(({ payload, context }) => {
        expect(payload).toMatchObject({
          action: 'clicked',
          actionSubject: 'button',
        });
        const flattenedContext = flattenContext(context);
        expect(flattenedContext).toHaveProperty('itemsCount');
        expect(typeof flattenedContext.itemsCount).toBe('number');
        done();
      });
  });
});
