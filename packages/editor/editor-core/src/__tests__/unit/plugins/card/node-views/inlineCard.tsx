let mockFindOverflowScrollParent = jest.fn();
jest.mock('@atlaskit/editor-common', () => ({
  browser: () => ({}),
  findOverflowScrollParent: () => mockFindOverflowScrollParent(),
  hexToRgba: jest.fn(),
  withImageLoader: jest.fn(),
  overflowShadow: jest.fn(),
}));

import * as React from 'react';
import { mount } from 'enzyme';
import { inlineCard, defaultSchema } from '@atlaskit/editor-test-helpers';
import { Card } from '@atlaskit/smart-card';

import { InlineCardComponent } from '../../../../../plugins/card/nodeviews/inlineCard';
import { EditorView } from 'prosemirror-view';

describe('inlineCard', () => {
  let mockEditorView: EditorView;

  beforeEach(() => {
    mockFindOverflowScrollParent = jest.fn();
    mockEditorView = {
      state: {
        selection: {
          from: 0,
          to: 0,
        },
      },
    } as EditorView;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render (findOverflowScrollParent returning false)', () => {
    mockFindOverflowScrollParent.mockImplementationOnce(() => false);
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const mockInlineCardNode = mount(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        selected={false}
        getPos={() => 0}
      />,
    );
    const wrapper = mockInlineCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    expect(wrapper.prop('container')).toBe(undefined);
    mockInlineCardNode.unmount();
  });

  it('should render (findOverflowScrollParent returning node)', () => {
    const scrollContainer = document.createElement('div');
    mockFindOverflowScrollParent.mockImplementationOnce(() => scrollContainer);
    const mockInlinePmNode = inlineCard({ url: 'https://some/url' })()(
      defaultSchema,
    );
    const mockInlineCardNode = mount(
      <InlineCardComponent
        node={mockInlinePmNode}
        view={mockEditorView}
        selected={false}
        getPos={() => 0}
      />,
    );
    const wrapper = mockInlineCardNode.find(Card);
    expect(wrapper).toHaveLength(1);
    expect(wrapper.prop('url')).toBe('https://some/url');
    expect(wrapper.prop('container')).toBe(scrollContainer);
    mockInlineCardNode.unmount();
  });
});
