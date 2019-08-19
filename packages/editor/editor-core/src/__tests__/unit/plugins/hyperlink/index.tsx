import createStub from 'raf-stub';
import {
  doc,
  createEditorFactory,
  a,
  p,
  insertText,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import * as Toolbar from '../../../../plugins/hyperlink/Toolbar';
import { FloatingToolbarHandler } from '../../../../plugins/floating-toolbar/types';
import { EditorProps } from '../../../../types';

describe('hyperlink', () => {
  const createEditor = createEditorFactory();
  let createAnalyticsEvent: CreateUIAnalyticsEvent;

  const editor = (doc: any, editorProps: EditorProps = {}) => {
    createAnalyticsEvent = jest.fn().mockReturnValue({ fire() {} });
    return createEditor({
      doc,
      editorProps: { allowAnalyticsGASV3: true, ...editorProps },
      createAnalyticsEvent,
    });
  };

  describe('link mark behaviour', () => {
    it('should not change the link text when typing text before a link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'google.com' })('{<>}google'))),
      );
      insertText(editorView, 'www.', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p('www.', a({ href: 'google.com' })('google'))),
      );
    });

    it('should not change the link text when typing after after a link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'google.com' })('google{<>}'))),
      );
      insertText(editorView, '.com', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'google.com' })('google'), '.com')),
      );
    });

    it('should change the links text when typing inside a link', () => {
      const { editorView, sel } = editor(
        doc(p(a({ href: 'google.com' })('web{<>}site'))),
      );
      insertText(editorView, '-', sel);
      expect(editorView.state.doc).toEqualDocument(
        doc(p(a({ href: 'google.com' })('web-site'))),
      );
    });
  });

  describe('quick insert', () => {
    it('should trigger link typeahead invoked analytics event', async () => {
      const { editorView, sel } = editor(doc(p('{<>}')));
      insertText(editorView, '/Link', sel);
      sendKeyToPm(editorView, 'Enter');

      expect(createAnalyticsEvent).toHaveBeenCalledWith({
        action: 'invoked',
        actionSubject: 'typeAhead',
        actionSubjectId: 'linkTypeAhead',
        attributes: { inputMethod: 'quickInsert' },
        eventType: 'ui',
      });
    });
  });

  describe('floating toolbar', () => {
    let waitForAnimationFrame: any;
    let getFloatingToolbarSpy: jest.SpyInstance<
      FloatingToolbarHandler | undefined
    >;

    beforeAll(() => {
      let stub = createStub();
      waitForAnimationFrame = stub.flush;
      jest.spyOn(window, 'requestAnimationFrame').mockImplementation(stub.add);
      getFloatingToolbarSpy = jest.spyOn(Toolbar, 'getToolbarConfig');
    });

    beforeEach(() => {
      getFloatingToolbarSpy.mockClear();
      ((window.requestAnimationFrame as any) as jest.SpyInstance<
        any
      >).mockClear();
    });

    afterAll(() => {
      ((window.requestAnimationFrame as any) as jest.SpyInstance<
        any
      >).mockRestore();
      getFloatingToolbarSpy.mockRestore();
    });

    it('should only add text, paragraph and heading, if no task/decision in schema', () => {
      editor(doc(p(a({ href: 'google.com' })('web{<>}site'))));

      waitForAnimationFrame();

      expect(getFloatingToolbarSpy).toHaveLastReturnedWith(
        expect.objectContaining({
          nodeType: [
            expect.objectContaining({ name: 'text' }),
            expect.objectContaining({ name: 'paragraph' }),
            expect.objectContaining({ name: 'heading' }),
          ],
        }),
      );
    });

    it('should include task and decision items from node type, if they exist in schema', () => {
      editor(doc(p(a({ href: 'google.com' })('web{<>}site'))), {
        allowTasksAndDecisions: true,
      });

      waitForAnimationFrame();

      expect(getFloatingToolbarSpy).toHaveLastReturnedWith(
        expect.objectContaining({
          nodeType: expect.arrayContaining([
            expect.objectContaining({ name: 'taskItem' }),
            expect.objectContaining({ name: 'decisionItem' }),
          ]),
        }),
      );
    });
  });
});
