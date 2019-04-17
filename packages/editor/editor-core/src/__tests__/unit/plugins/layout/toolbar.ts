import { doc, createEditorFactory } from '@atlaskit/editor-test-helpers';
import { IntlProvider } from 'react-intl';
import { buildToolbar, messages } from '../../../../plugins/layout/toolbar';
import { EditorView } from 'prosemirror-view';
import { FloatingToolbarConfig } from '../../../../plugins/floating-toolbar/types';
import { MessageDescriptor } from '../../../../types';
import commonMessages from '../../../../messages';
import { buildLayoutForWidths } from './_utils';

describe('layout toolbar', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: { allowLayouts: true },
    });

  const intlProvider = new IntlProvider({ locale: 'en' });
  const { intl } = intlProvider.getChildContext();
  const stdLayoutButtons = [messages.twoColumns, messages.threeColumns];
  const moreLayoutButtons = [messages.leftSidebar, messages.rightSidebar];
  let editorView: EditorView;
  let toolbar: FloatingToolbarConfig;

  const findToolbarBtn = (
    toolbar: FloatingToolbarConfig,
    message: MessageDescriptor,
  ) =>
    toolbar.items.find(
      item =>
        item.type === 'button' && item.title === intl.formatMessage(message),
    );

  beforeEach(() => {
    ({ editorView } = editor(doc(buildLayoutForWidths([50, 50], true))));
  });

  describe('with "addSidebarLayouts"', () => {
    beforeEach(() => {
      toolbar = buildToolbar(
        editorView.state,
        intl,
        0,
        true,
        true,
      ) as FloatingToolbarConfig;
    });

    it('displays all 4 layout buttons', () => {
      stdLayoutButtons.forEach(button => {
        expect(findToolbarBtn(toolbar, button)).toBeDefined();
      });
      moreLayoutButtons.forEach(button => {
        expect(findToolbarBtn(toolbar, button)).toBeDefined();
      });
    });

    it('displays delete button', () => {
      expect(findToolbarBtn(toolbar, commonMessages.remove)).toBeDefined();
    });
  });

  describe('without "addSidebarLayouts"', () => {
    beforeEach(() => {
      toolbar = buildToolbar(
        editorView.state,
        intl,
        0,
        true,
        false,
      ) as FloatingToolbarConfig;
    });

    it('displays only 2 original layout buttons', () => {
      stdLayoutButtons.forEach(button => {
        expect(findToolbarBtn(toolbar, button)).toBeDefined();
      });
      moreLayoutButtons.forEach(button => {
        expect(findToolbarBtn(toolbar, button)).not.toBeDefined();
      });
    });

    it('displays delete button', () => {
      expect(findToolbarBtn(toolbar, commonMessages.remove)).toBeDefined();
    });
  });
});
