import {
  doc,
  insertText,
  createEditorFactory,
  p,
} from '@atlaskit/editor-test-helpers';

describe('placeholder', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any, trackEvent = () => {}) =>
    createEditor({
      doc,
      editorProps: {
        placeholder: 'potato',
        analyticsHandler: trackEvent,
      },
    });

  const placeholderHtml =
    '<p><span class="placeholder-decoration ProseMirror-widget"><span>potato</span></span><br></p>';

  it('renders a placeholder on a blank document', () => {
    const { editorView } = editor(doc(p()));
    expect(editorView.dom.innerHTML).toEqual(placeholderHtml);
  });

  it('disappears when content is added to document', () => {
    const { editorView } = editor(doc(p()));
    expect(editorView.dom.innerHTML).toEqual(placeholderHtml);

    insertText(editorView, 'a', 0);
    expect(editorView.dom.innerHTML).toEqual('<p>a</p><p><br></p>');
  });
});
