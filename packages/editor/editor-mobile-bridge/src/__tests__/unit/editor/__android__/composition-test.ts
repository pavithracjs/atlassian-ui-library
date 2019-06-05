import { doc, createEditorFactory, p } from '@atlaskit/editor-test-helpers';

import { EditorViewWithComposition } from '../../../../types';

const InputEvent = (window as any).InputEvent;

const androidCompose = (view: EditorViewWithComposition, events: Event[]) =>
  events.forEach(event => view.dom.dispatchEvent(event));

const androidComposeStart = (view: EditorViewWithComposition, data?: string) =>
  androidCompose(view, [
    new CompositionEvent('compositionstart'),
    new InputEvent('beforeinput', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
    }),
    new CompositionEvent('compositionupdate', {
      data,
    }),
    new InputEvent('input', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
    }),
  ]);

const androidComposeContinue = (
  view: EditorViewWithComposition,
  data: string,
) =>
  androidCompose(view, [
    new InputEvent('beforeinput', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
    }),
    new CompositionEvent('compositionupdate', {
      data,
    }),
    new InputEvent('input', {
      data,
      isComposing: true,
      inputType: 'insertCompositionText',
    }),
  ]);

const androidComposeEnd = (view: EditorViewWithComposition, data: string) =>
  androidCompose(view, [
    new CompositionEvent('compositionend', {
      data,
    } as CompositionEvent),
  ]);

describe('composition events on mobile', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any): EditorViewWithComposition => {
    const { editorView } = createEditor({
      doc,
      editorPlugins: [],
      editorProps: {
        analyticsHandler: () => {},
      },
    });

    return editorView as EditorViewWithComposition;
  };

  beforeEach(() => jest.useFakeTimers());

  it('updates PM state on compositionstart', () => {
    const editorView = editor(doc(p()));
    expect(editorView.composing).toBeFalsy();

    // mutate DOM to final state
    editorView.dom.children[0].innerHTML = 'hello';

    // start composition
    androidComposeStart(editorView, 'hello');
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    expect(editorView.composing).toBeFalsy();
    expect(editorView.state.doc).toEqualDocument(doc(p('hello')));
  });

  it('updates PM state on single compositionupdate', () => {
    const editorView = editor(doc(p('hello ')));
    expect(editorView.composing).toBeFalsy();

    // mutate DOM to final state
    editorView.dom.children[0].innerHTML = "hello I'm";

    // continue composition
    androidComposeContinue(editorView, "I'm");
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    expect(editorView.composing).toBeFalsy();
    expect(editorView.state.doc).toEqualDocument(doc(p('hello I’m')));
  });

  it('updates PM state on multiple compositionupdate', () => {
    const editorView = editor(doc(p('hello ')));
    expect(editorView.composing).toBeFalsy();

    // mutate DOM to final state
    editorView.dom.children[0].innerHTML = 'hello it';

    // continue multiple compositions
    androidComposeContinue(editorView, "I'm");
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    androidComposeContinue(editorView, 'it');
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    expect(editorView.composing).toBeFalsy();
    expect(editorView.state.doc).toEqualDocument(doc(p('hello it')));
  });

  it('updates PM state on compositionend', () => {
    const editorView = editor(doc(p('hello it')));
    expect(editorView.composing).toBeFalsy();

    // mutate DOM to final state
    editorView.dom.children[0].innerHTML = 'hello it works!';

    // continue composition till end
    androidComposeContinue(editorView, 'workz');
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    androidComposeContinue(editorView, 'workgrrrbbrrr');
    expect(editorView.composing).toBeTruthy();

    jest.runOnlyPendingTimers();

    androidComposeEnd(editorView, 'works!');

    expect(editorView.composing).toBeFalsy();
    expect(editorView.state.doc).toEqualDocument(doc(p('hello it works!')));
  });
});
