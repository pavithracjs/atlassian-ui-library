import * as React from 'react';
import {
  doc,
  p,
  createEditorFactory,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers';
import { ReactWrapper } from 'enzyme';
import {
  AlignmentPluginState,
  pluginKey,
} from '../../../../../plugins/alignment/pm-plugins/main';
import ToolbarAlignment, {
  Props as ToolbarAlignmentProps,
} from '../../../../../plugins/alignment/ui/ToolbarAlignment';

describe('ToolbarAlignment', () => {
  const createEditor = createEditorFactory<AlignmentPluginState>();
  let toolbarAlignment: ReactWrapper<ToolbarAlignmentProps>;

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        allowTextAlignment: true,
      },
      pluginKey,
    });

  beforeEach(() => {
    const { editorView } = editor(doc(p('text')));
    const pluginState = pluginKey.getState(editorView.state);
    toolbarAlignment = mountWithIntl(
      <ToolbarAlignment
        pluginState={pluginState}
        changeAlignment={jest.fn()}
      />,
    );
  });

  afterEach(() => {
    if (toolbarAlignment && typeof toolbarAlignment.unmount === 'function') {
      toolbarAlignment.unmount();
    }
  });

  it('should open menu when toolbar alignment button is clicked', () => {
    toolbarAlignment.find('button').simulate('click');

    expect(toolbarAlignment.state('isOpen')).toBe(true);
  });

  it('should close menu when an option is clicked', () => {
    toolbarAlignment.find('button').simulate('click');
    toolbarAlignment
      .find('.align-btn')
      .at(1)
      .simulate('click');

    expect(toolbarAlignment.state('isOpen')).toBe(false);
  });

  it('should close menu when toolbar alignment button is clicked again', () => {
    toolbarAlignment.find('button').simulate('click');
    toolbarAlignment
      .find('button')
      .at(0)
      .simulate('click');

    expect(toolbarAlignment.state('isOpen')).toBe(false);
  });
});
