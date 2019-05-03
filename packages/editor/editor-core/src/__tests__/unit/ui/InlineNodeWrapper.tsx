import * as React from 'react';
import { mount } from 'enzyme';

import InlineNodeWrapper, {
  createMobileInlineDomRef,
  InlineNodeInnerWrapper,
} from '../../../ui/InlineNodeWrapper';

describe('@atlaskit/editor-core/ui/InlineNodeWrapper', () => {
  it('should wrap inline node on mobile', () => {
    const inlineNode1 = mount(
      <InlineNodeWrapper appearance="mobile">
        <span>text</span>
      </InlineNodeWrapper>,
    );

    const inlineNode2 = mount(
      <InlineNodeWrapper appearance="chromeless">
        <span>text</span>
      </InlineNodeWrapper>,
    );

    const inlineNode3 = mount(
      <InlineNodeWrapper appearance="full-page">
        <span>text</span>
      </InlineNodeWrapper>,
    );

    const inlineNode4 = mount(
      <InlineNodeWrapper appearance="comment">
        <span>text</span>
      </InlineNodeWrapper>,
    );

    expect(inlineNode1.find(InlineNodeInnerWrapper).exists()).toBe(true);
    expect(inlineNode2.find(InlineNodeInnerWrapper).exists()).toBe(false);
    expect(inlineNode3.find(InlineNodeInnerWrapper).exists()).toBe(false);
    expect(inlineNode4.find(InlineNodeInnerWrapper).exists()).toBe(false);
  });

  it('InlineNodeInnerWrapper should be a block', () => {
    const inlineNodeInnerWrapper = mount(<InlineNodeInnerWrapper />);
    expect(inlineNodeInnerWrapper).toHaveStyleRule('display', 'block');
  });

  it('createMobileInlineDomRef() should create non-editable inline-block', () => {
    const domRef = createMobileInlineDomRef();
    expect(domRef).toBeInstanceOf(HTMLSpanElement);
    expect(domRef.contentEditable).toEqual('false');
    expect(domRef.classList.contains('inline-node--mobile')).toBe(true);
  });
});
