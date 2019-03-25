import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import Switcher from '../../components/switcher';
import { MANAGE_HREF } from '../../providers/jira-data-providers';
import { mapResultsToSwitcherProps } from '../../providers/map-results-to-switcher-props';
import Item from '@atlaskit/item';
import ManageButton from '../../primitives/manage-button';
import messages from '../../utils/messages';
import { IntlProvider } from 'react-intl';
import '../../../test-helpers/mock-fetch';
import createStream, { Stream } from '../../../test-helpers/stream';
import ORIGINAL_MOCK_DATA from '../../../examples/helpers/mock-data';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import {
  UIAnalyticsEventInterface,
  ObjectType,
} from '@atlaskit/analytics-next-types/index';
import {
  RecentContainersResponse,
  LicenseInformationResponse,
  CustomLinksResponse,
} from '../../types';
import { Status, ResultComplete } from '../../providers/as-data-provider';
function wrapResult<T>(data: T): ResultComplete<T> {
  return {
    status: Status.COMPLETE,
    data,
  };
}

const getCommonDataProviderResults = () => {
  return {
    recentContainers: wrapResult<RecentContainersResponse>(
      ORIGINAL_MOCK_DATA.RECENT_CONTAINERS_DATA,
    ),
    licenseInformation: wrapResult<LicenseInformationResponse>(
      ORIGINAL_MOCK_DATA.LICENSE_INFORMATION_DATA,
    ),
    managePermission: wrapResult<boolean>(true),
    addProductsPermission: wrapResult<boolean>(true),
    isXFlowEnabled: wrapResult<boolean>(true),
  };
};

const DefaultAtlassianSwitcher = (props: any = {}) => {
  const { showManageLink, ...switcherLinks } = mapResultsToSwitcherProps(
    props.cloudId,
    {
      customLinks: wrapResult<CustomLinksResponse>(
        ORIGINAL_MOCK_DATA.CUSTOM_LINKS_DATA,
      ),
      ...getCommonDataProviderResults(),
    },
    { xflow: true, enableSplitJira: props.enableSplitJira },
  );
  return (
    <IntlProvider locale="en">
      <AnalyticsListener channel="*" onEvent={props.onEventFired}>
        <Switcher
          product="jira"
          cloudId="some-cloud-id"
          triggerXFlow={() => 'triggering xflow'}
          manageLink={showManageLink ? MANAGE_HREF : undefined}
          messages={messages}
          {...switcherLinks}
          {...props}
        />
      </AnalyticsListener>
    </IntlProvider>
  );
};

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
  it('should fire "atlassianSwitcher rendered"', async () => {
    const { payload } = await eventStream.next();
    expect(payload).toMatchObject({
      eventType: 'operational',
      action: 'rendered',
      actionSubject: 'atlassianSwitcher',
    });
    expect(payload.attributes).toHaveProperty('duration');
    expect(payload.attributes.duration).toBeGreaterThanOrEqual(0);
  });

  it('should fire "atlassianSwitcherItem clicked"', async () => {
    await eventStream.skip(1);
    const item = wrapper.find(Item);
    item.at(0).simulate('click');
    const { payload, context } = await eventStream.next();
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
  });

  it('should fire "button clicked - manageListButton"', async () => {
    await eventStream.skip(1);
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
    const { payload, context } = await eventStream.next();
    expect(payload).toMatchObject({
      action: 'clicked',
      actionSubject: 'button',
    });
    const flattenedContext = flattenContext(context);
    expect(flattenedContext).toHaveProperty('itemsCount');
    expect(typeof flattenedContext.itemsCount).toBe('number');
  });
});
