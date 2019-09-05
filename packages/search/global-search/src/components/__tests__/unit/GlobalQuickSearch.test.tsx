import * as React from 'react';
import { mount } from 'enzyme';
import GlobalQuickSearchWithAnalytics, {
  GlobalQuickSearch,
  Props,
} from '../../GlobalQuickSearch';
import * as AnalyticsHelper from '../../../util/analytics-event-helper';
import { CreateAnalyticsEventFn } from '../../analytics/types';
import { ReferralContextIdentifiers } from '../../GlobalQuickSearchWrapper';
import {
  FilterType,
  FilterWithMetadata,
} from '../../../api/CrossProductSearchClient';

const noop = () => {};
const DEFAULT_PROPS = {
  onSearch: noop,
  onAutocomplete: noop,
  onMount: noop,
  isLoading: false,
  searchSessionId: 'abc',
  children: [],
  advancedSearchId: 'product_advanced_search',
};

function render(partialProps: Partial<Props>) {
  const props: Props = {
    ...DEFAULT_PROPS,
    ...partialProps,
  };

  return mount(<GlobalQuickSearch {...props} />);
}

describe('GlobalQuickSearch', () => {
  describe('GlobalQuickSearchWithAnalytics', () => {
    it('should render GlobalQuickSearch with a createAnalyticsEvent prop', () => {
      const wrapper = mount(
        <GlobalQuickSearchWithAnalytics {...DEFAULT_PROPS} />,
      );
      expect(
        wrapper.find(GlobalQuickSearch).prop('createAnalyticsEvent'),
      ).toBeDefined();
    });
  });

  it('should call onMount on mount, duh', () => {
    const onMountMock = jest.fn();
    render({ onMount: onMountMock });
    expect(onMountMock).toHaveBeenCalled();
  });

  it('should handle search input', () => {
    const searchMock = jest.fn();
    const wrapper = render({ onSearch: searchMock });

    const onSearchInput: Function = wrapper
      .find('QuickSearch')
      .prop('onSearchInput');
    onSearchInput({ target: { value: 'foo' } });

    expect(searchMock).toHaveBeenCalledWith('foo', 0, undefined);
  });

  it('should handle searching with filter applied', () => {
    const searchMock = jest.fn();
    const filters: FilterWithMetadata[] = [
      { filter: { '@type': FilterType.Spaces, spaceKeys: ['TEST'] } },
    ];
    const wrapper = render({ onSearch: searchMock, filters });

    const onSearchInput: Function = wrapper
      .find('QuickSearch')
      .prop('onSearchInput');
    onSearchInput({ target: { value: 'foo' } });

    expect(searchMock).toHaveBeenCalledWith('foo', 0, filters);
  });

  it('should fire searches with the queryVersion parameter incrementing', () => {
    const searchMock = jest.fn();
    const wrapper = render({ onSearch: searchMock });

    const onSearchInput: Function = wrapper
      .find('QuickSearch')
      .prop('onSearchInput');

    onSearchInput({ target: { value: 'foo' } });
    expect(searchMock).toHaveBeenNthCalledWith(1, 'foo', 0, undefined);

    onSearchInput({ target: { value: 'foo' } });
    expect(searchMock).toHaveBeenNthCalledWith(2, 'foo', 1, undefined);
  });

  it('should trim the search input', () => {
    const searchMock = jest.fn();
    const wrapper = render({ onSearch: searchMock });

    const onSearchInput: Function = wrapper
      .find('QuickSearch')
      .prop('onSearchInput');
    onSearchInput({ target: { value: '  pattio   ' } });

    expect(searchMock).toHaveBeenCalledWith('pattio', 0, undefined);
  });

  describe('Search result events', () => {
    const searchSessionId = 'random-session-id';
    let fireHighlightEventSpy: jest.SpyInstance<
      (
        eventData: AnalyticsHelper.KeyboardControlEvent,
        searchSessionId: string,
        referralContextIdentifiers?: ReferralContextIdentifiers,
        createAnalyticsEvent?: CreateAnalyticsEventFn | undefined,
      ) => void
    >;
    let fireSearchResultSelectedEventSpy: jest.SpyInstance<
      (
        eventData: AnalyticsHelper.SelectedSearchResultEvent,
        searchSessionId: string,
        referralContextIdentifiers?: ReferralContextIdentifiers,
        createAnalyticsEvent?: CreateAnalyticsEventFn | undefined,
      ) => void
    >;
    let fireAdvancedSearchSelectedEventSpy: jest.SpyInstance<
      (
        eventData: AnalyticsHelper.AdvancedSearchSelectedEvent,
        searchSessionId: string,
        referralContextIdentifiers?: ReferralContextIdentifiers,
        createAnalyticsEvent?: CreateAnalyticsEventFn | undefined,
      ) => void
    >;
    beforeEach(() => {
      fireHighlightEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireHighlightedSearchResult',
      );
      fireSearchResultSelectedEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireSelectedSearchResult',
      );
      fireAdvancedSearchSelectedEventSpy = jest.spyOn(
        AnalyticsHelper,
        'fireSelectedAdvancedSearch',
      );
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    const deepRender = (): Function =>
      render({ searchSessionId })
        .find('QuickSearch')
        .prop('firePrivateAnalyticsEvent');

    ['ArrowUp', 'ArrowDown'].forEach(key => {
      it('should trigger highlight event', () => {
        const firePrivateAnalyticsEvent = deepRender();
        const eventData = {
          resultId: 'result-id',
          type: 'recent-result',
          contentType: 'confluence-page',
          sectionIndex: 2,
          index: 11,
          indexWithinSection: 2,
          key,
        };
        // call
        firePrivateAnalyticsEvent(
          'atlaskit.navigation.quick-search.keyboard-controls-used',
          eventData,
        );

        // asserts
        expect(fireHighlightEventSpy.mock.calls.length).toBe(1);
        expect(fireHighlightEventSpy.mock.calls[0][0]).toMatchObject(eventData);
        expect(fireHighlightEventSpy.mock.calls[0][1]).toBe(searchSessionId);

        // verify other spies are not called
        [
          fireAdvancedSearchSelectedEventSpy,
          fireSearchResultSelectedEventSpy,
        ].forEach(spy => expect(spy.mock.calls.length).toBe(0));
      });
    });

    it('should not fire highlight event on enter', () => {
      const firePrivateAnalyticsEvent = deepRender();
      const eventData = {
        resultId: 'result-id',
        type: 'recent-result',
        contentType: 'confluence-page',
        sectionIndex: 2,
        index: 11,
        indexWithinSection: 2,
        key: 'Enter',
      };
      // call
      firePrivateAnalyticsEvent(
        'atlaskit.navigation.quick-search.keyboard-controls-used',
        eventData,
      );

      // verify
      [
        fireAdvancedSearchSelectedEventSpy,
        fireSearchResultSelectedEventSpy,
        fireHighlightEventSpy,
      ].forEach(spy => expect(spy.mock.calls.length).toBe(0));
    });

    it('should fire selected search event', () => {
      const firePrivateAnalyticsEvent = deepRender();
      const eventData = {
        resultId: 'result-id',
        type: 'recent-result',
        contentType: 'confluence-page',
        sectionIndex: 2,
        index: 11,
        indexWithinSection: 2,
        method: 'click',
        newTab: false,
      };

      // call
      firePrivateAnalyticsEvent(
        'atlaskit.navigation.quick-search.submit',
        eventData,
      );

      // assert
      expect(fireSearchResultSelectedEventSpy.mock.calls.length).toBe(1);
      expect(fireSearchResultSelectedEventSpy.mock.calls[0][0]).toMatchObject(
        eventData,
      );
      expect(fireSearchResultSelectedEventSpy.mock.calls[0][1]).toBe(
        searchSessionId,
      );

      // verify
      [fireAdvancedSearchSelectedEventSpy, fireHighlightEventSpy].forEach(spy =>
        expect(spy.mock.calls.length).toBe(0),
      );
    });

    it('should fire advanced search event', () => {
      const firePrivateAnalyticsEvent = deepRender();
      const eventData = {
        resultId: 'search_confluence',
        type: 'recent-result',
        contentType: 'confluence-page',
        sectionIndex: 2,
        index: 11,
        indexWithinSection: 2,
        method: 'click',
        newTab: false,
      };

      // call
      firePrivateAnalyticsEvent(
        'atlaskit.navigation.quick-search.submit',
        eventData,
      );

      // assert
      expect(fireAdvancedSearchSelectedEventSpy.mock.calls.length).toBe(1);
      expect(fireAdvancedSearchSelectedEventSpy.mock.calls[0][0]).toMatchObject(
        eventData,
      );
      expect(fireAdvancedSearchSelectedEventSpy.mock.calls[0][1]).toBe(
        searchSessionId,
      );

      // verify
      [fireSearchResultSelectedEventSpy, fireHighlightEventSpy].forEach(spy =>
        expect(spy.mock.calls.length).toBe(0),
      );
    });
  });
});
