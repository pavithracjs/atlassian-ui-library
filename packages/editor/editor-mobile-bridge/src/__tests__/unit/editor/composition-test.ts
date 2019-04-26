import { EditorView } from 'prosemirror-view';

import {
  doc,
  createEditorFactory,
  p,
  sleep,
} from '@atlaskit/editor-test-helpers';

interface InputEvent extends UIEvent, Event {
  data: string;
  dataTransfer: DataTransfer;
  inputType: string;
  readonly isComposing: boolean;
}

function androidComposeStart(view: EditorView, data: string) {
  view.dom.dispatchEvent(
    new CustomEvent('keydown', {
      charCode: 0,
      keyCode: 229,
      which: 229,
      view: window,
    } as any),
  );

  view.dom.dispatchEvent(
    new CustomEvent('compositionstart', {
      data: '',
      view: window,
    } as CompositionEvent),
  );

  view.dom.dispatchEvent(
    new CustomEvent('beforeinput', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
      view: window,
    } as InputEvent),
  );

  view.dom.dispatchEvent(
    new CustomEvent('compositionupdate', {
      data,
      view: window,
    } as CompositionEvent),
  );

  view.dom.dispatchEvent(
    new CustomEvent('input', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
      view: window,
    } as InputEvent),
  );

  view.dom.dispatchEvent(
    new CustomEvent('keyup', {
      charCode: 0,
      keyCode: 229,
      which: 229,
      altKey: false,
      view: window,
      isComposing: true,
    } as any),
  );
}

function androidComposeContinue(view: EditorView, data: string) {
  view.dom.dispatchEvent(
    new CustomEvent('keydown', {
      charCode: 0,
      keyCode: 229,
      which: 229,
      view: window,
      isComposing: true,
    } as any),
  );

  view.dom.dispatchEvent(
    new CustomEvent('beforeinput', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
      view: window,
    } as InputEvent),
  );

  view.dom.dispatchEvent(
    new CustomEvent('compositionupdate', {
      data,
      view: window,
    } as CompositionEvent),
  );

  view.dom.dispatchEvent(
    new CustomEvent('input', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
      view: window,
    } as InputEvent),
  );

  // by this point, the DOM should now be synced with 'data'
  view.dom.dispatchEvent(
    new CustomEvent('keyup', {
      charCode: 0,
      keyCode: 229,
      which: 229,
      view: window,
      isComposing: true,
    } as any),
  );
}

function androidComposeEnd(view: EditorView, data: string) {
  view.dom.dispatchEvent(
    new CustomEvent('compositionend', {
      data,
      view: window,
    } as CompositionEvent),
  );
}

describe('composition', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any, trackEvent = () => {}) =>
    createEditor({
      doc,
      editorPlugins: [],
      editorProps: {
        analyticsHandler: trackEvent,
      },
    });

  it('keeps content after a full composition completes', async () => {
    const { editorView } = editor(doc(p()));

    androidComposeStart(editorView, 'a');
    expect(editorView.dom.innerHTML).toEqual('<p>a</p>');

    androidComposeContinue(editorView, 'ab');
    expect(editorView.dom.innerHTML).toEqual('<p>ab</p>');

    androidComposeEnd(editorView, 'ab');
    expect(editorView.dom.innerHTML).toEqual('<p>ab</p>');
    expect(editorView.state.doc).toEqualDocument(doc(p('ab')));
  });
});
