import { expect } from 'chai';
import { mount, ReactWrapper } from 'enzyme';

import { mountEditor } from './utils';
import mobileEditor from '../../../src/editor/mobile-editor-element';

declare var bridge: any;

describe('NativeToWebBridge', () => {
  const originalContent = {
    version: 1,
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'test' }] }],
  };

  let wrapper: ReactWrapper;
  beforeEach(async () => {
    wrapper = mount(mobileEditor({}));
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('sets content', async () => {
    bridge.setContent(JSON.stringify(originalContent));

    const value = await bridge.editorActions.getValue();
    expect(value).to.be.deep.equal(originalContent);
  });

  it('gets content', () => {
    bridge.editorActions.replaceDocument(JSON.stringify(originalContent));

    const content = bridge.getContent();
    expect(JSON.parse(content)).to.be.deep.equal(originalContent);
  });

  it('can set headings', () => {
    const withHeading = {
      version: 1,
      type: 'doc',
      content: [
        {
          attrs: { level: 2 },
          type: 'heading',
          content: [{ type: 'text', text: 'test' }],
        },
      ],
    };

    bridge.editorActions.replaceDocument(JSON.stringify(originalContent));
    bridge.onBlockSelected('heading2');
    const content = bridge.getContent();
    expect(JSON.parse(content)).to.be.deep.equal(withHeading);
  });
});

describe('set padding', () => {
  let editor: any;
  beforeEach(async () => {
    editor = await mountEditor();
  });

  afterEach(() => {
    editor.unmount();
  });

  it('sets padding on the editor', () => {
    bridge.setPadding(
      20 /* Top */,
      10 /* Right */,
      20 /* Bottom */,
      10 /* Left */,
    );

    const root = bridge.getRootElement();
    expect(root.style.padding).to.equal('20px 10px');
  });
});
