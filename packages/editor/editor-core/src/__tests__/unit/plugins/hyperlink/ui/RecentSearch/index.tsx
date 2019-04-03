import { ReactWrapper } from 'enzyme';
import * as React from 'react';
import RecentSearch from '../../../../../../plugins/hyperlink/ui/RecentSearch/LinkAddToolbar';
import RecentItem from '../../../../../../plugins/hyperlink/ui/RecentSearch/RecentItem';
import { MockActivityResource } from '../../utils';
import { mountWithIntl } from '@atlaskit/editor-test-helpers';

const timeout = () => new Promise(resolve => window.setTimeout(resolve, 1));

function pressDownArrowInputField(recentSearch: ReactWrapper<any, any>) {
  recentSearch.find('input').simulate('keydown', { keyCode: 40 });
}

function pressReturnInputField(recentSearch: ReactWrapper<any, any>) {
  recentSearch.find('input').simulate('keydown', { keyCode: 13 });
}

describe('@atlaskit/editor-core/ui/RecentSearch', () => {
  let dispatchAnalyticsSpy: jest.Mock;
  let wrapper: ReactWrapper;
  let onSubmit: jest.Mock;

  beforeEach(async () => {
    onSubmit = jest.fn();
    dispatchAnalyticsSpy = jest.fn();
    wrapper = mountWithIntl(
      <RecentSearch
        onSubmit={onSubmit}
        provider={Promise.resolve(new MockActivityResource())}
        dispatchAnalyticsEvent={dispatchAnalyticsSpy}
      />,
    );
    await timeout();
    wrapper.update();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render a list of recent activity items', () => {
    expect(wrapper.find(RecentItem)).toHaveLength(3);
  });

  it('should filter recent activity items by input text', async () => {
    (wrapper.instance() as any).updateInput('recent item 1');
    await timeout();
    wrapper.update();

    expect(wrapper.find(RecentItem)).toHaveLength(1);
    expect(
      wrapper
        .find(RecentItem)
        .at(0)
        .prop('item'),
    ).toHaveProperty('name', 'recent item 1');
  });

  it('should submit with selected activity item when clicked', () => {
    wrapper
      .find(RecentItem)
      .at(1)
      .simulate('mousedown');

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('recent2-url.com', 'recent item 2');
  });

  it('should submit with selected activity item when enter is pressed', async () => {
    (wrapper.instance() as any).updateInput('recent');
    await timeout();
    pressReturnInputField(wrapper);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('recent1-url.com', 'recent item 1');
  });

  it('should submit with selected activity item when navigated to via keyboard and enter pressed', () => {
    pressDownArrowInputField(wrapper);
    pressDownArrowInputField(wrapper);
    pressReturnInputField(wrapper);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('recent2-url.com', 'recent item 2');
  });

  it('should submit arbitrary link', async () => {
    (wrapper.instance() as any).updateInput('example.com');
    pressReturnInputField(wrapper);
    await timeout();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith('example.com');
  });

  describe('analytics v3', () => {
    describe('for typeahead', () => {
      it('via keyboard', async () => {
        (wrapper.instance() as any).updateInput('recent');
        await timeout();
        pressReturnInputField(wrapper);

        expect(dispatchAnalyticsSpy).toHaveBeenCalledWith({
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: 'link',
          attributes: { inputMethod: 'typeAhead' },
          eventType: 'track',
        });
      });

      it('via mouseclick', () => {
        wrapper
          .find(RecentItem)
          .at(1)
          .simulate('mousedown');

        expect(dispatchAnalyticsSpy).toHaveBeenCalledWith({
          action: 'inserted',
          actionSubject: 'document',
          actionSubjectId: 'link',
          attributes: { inputMethod: 'typeAhead' },
          eventType: 'track',
        });
      });
    });

    it('for manual', async () => {
      (wrapper.instance() as any).updateInput('example.com');
      pressReturnInputField(wrapper);
      await timeout();

      expect(dispatchAnalyticsSpy).toHaveBeenCalledWith({
        action: 'inserted',
        actionSubject: 'document',
        actionSubjectId: 'link',
        attributes: { inputMethod: 'manual' },
        eventType: 'track',
      });
    });
  });
});
