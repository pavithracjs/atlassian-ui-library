import * as React from 'react';
import CachingConfluenceClient from '../../api/CachingConfluenceClient';
import {
  // @ts-ignore (additional export from mocked version)
  confluenceRecentItemsPromise,
} from '../../api/prefetchResults';
import { ConfluenceQuickSearchContainer } from '../../components/confluence/ConfluenceQuickSearchContainer';
import GlobalQuickSearch from '../../components/GlobalQuickSearchWrapper';
import { HomeQuickSearchContainer } from '../../components/home/HomeQuickSearchContainer';
import { JiraQuickSearchContainer } from '../../components/jira/JiraQuickSearchContainer';
import PrefetchedResultsProvider from '../../components/PrefetchedResultsProvider';
import { mountWithIntl } from './helpers/_intl-enzyme-test-helper';
import { QuickSearchContext } from '../../api/types';

jest.mock('../../api/prefetchResults');
jest.mock('../../api/CachingConfluenceClient');

it('should render the home container with context home', () => {
  const wrapper = mountWithIntl(
    <GlobalQuickSearch cloudId="123" context="home" />,
  );

  expect(wrapper.find(HomeQuickSearchContainer).exists()).toBe(true);
});

it('should render the confluence container with context confluence', () => {
  const wrapper = mountWithIntl(
    <GlobalQuickSearch cloudId="123" context="confluence" />,
  );

  expect(wrapper.find(ConfluenceQuickSearchContainer).exists()).toBe(true);
});

const MyLinkComponent = class extends React.Component<{
  className: string;
  children: React.ReactNode;
}> {
  render() {
    return <div />;
  }
};

it('should pass through the linkComponent prop', () => {
  const wrapper = mountWithIntl(
    <GlobalQuickSearch
      cloudId="123"
      context="confluence"
      linkComponent={MyLinkComponent}
    />,
  );

  expect(
    wrapper.find(ConfluenceQuickSearchContainer).prop('linkComponent'),
  ).toBe(MyLinkComponent);
});

describe('Prefetch', () => {
  it('should use prefetched data', async () => {
    const cloudId = '123';
    const context = 'confluence';

    mountWithIntl(
      <PrefetchedResultsProvider
        context={context}
        cloudId={cloudId}
        searchSessionId="searchSessionId"
      >
        <GlobalQuickSearch
          cloudId={cloudId}
          context={context}
          linkComponent={MyLinkComponent}
        />
      </PrefetchedResultsProvider>,
    );

    await confluenceRecentItemsPromise;

    expect(CachingConfluenceClient).toHaveBeenCalledWith(
      '/wiki',
      '123',
      confluenceRecentItemsPromise,
    );
  });
});

describe('advanced search callback', () => {
  [
    {
      product: 'jira',
      Component: JiraQuickSearchContainer,
      category: 'issues',
    },
    {
      product: 'confluence',
      Component: ConfluenceQuickSearchContainer,
      category: 'conent',
    },
  ].forEach(({ product, Component, category }) => {
    it(`should call on advanced callback on ${product} component`, () => {
      const spy = jest.fn();
      const wrapper = mountWithIntl(
        <GlobalQuickSearch
          cloudId="123"
          context={product as QuickSearchContext}
          onAdvancedSearch={spy}
        />,
      );

      const component = wrapper.find(Component);
      expect(component.exists()).toBe(true);

      const callback = component.prop('onAdvancedSearch');
      expect(callback).toBeInstanceOf(Function);

      const event = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      };

      if (callback) {
        callback(event, category, 'query', 'sessionId');
      }

      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith({
        category,
        query: 'query',
        preventDefault: expect.any(Function),
        originalEvent: event,
        searchSessionId: 'sessionId',
      });
    });

    it('should call prevent default and stop propagation', () => {
      const spy = jest.fn(e => {
        e.preventDefault();
      });
      const wrapper = mountWithIntl(
        <GlobalQuickSearch
          cloudId="123"
          context={product as QuickSearchContext}
          onAdvancedSearch={spy}
        />,
      );
      const mockedEvent = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn(),
      };
      const callback = wrapper.find(Component).prop('onAdvancedSearch');
      if (callback) {
        callback(mockedEvent, category, 'query', 'sessionId');
      }

      expect(mockedEvent.preventDefault).toBeCalledTimes(1);
      expect(mockedEvent.stopPropagation).toBeCalledTimes(1);
    });
  });
});
