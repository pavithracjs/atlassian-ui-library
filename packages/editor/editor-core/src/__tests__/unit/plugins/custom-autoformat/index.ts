import { ADFEntity } from '@atlaskit/adf-utils';
import { ProviderFactory } from '@atlaskit/editor-common';
import {
  doc,
  createEditorFactory,
  p,
  insertText,
  ul,
  li,
  sendKeyToPm,
} from '@atlaskit/editor-test-helpers';

import { pluginKey } from '../../../../plugins/custom-autoformat/utils';
import { AutoformattingProvider } from '../../../../plugins/custom-autoformat/types';

describe('custom-autoformat', () => {
  const createEditor = createEditorFactory();

  const niceProvider: AutoformattingProvider = {
    getRules() {
      return Promise.resolve({
        za: () => {
          const replacement = Promise.resolve({
            type: 'text',
            text: 'nice',
          });
          promises.push(replacement);
          return replacement;
        },
      });
    },
  };

  let autoformattingProvider: Promise<AutoformattingProvider>;
  const promises: Array<Promise<ADFEntity>> = [];
  const providerFactory = new ProviderFactory();

  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorProps: {
        autoformattingProvider,
        allowLists: true,
      },
      providerFactory,
      pluginKey,
    });
  };

  afterEach(async () => {
    await Promise.all(promises);
    promises.splice(0, promises.length);
  });

  describe('autoformatting', () => {
    beforeEach(() => {
      autoformattingProvider = Promise.resolve(niceProvider);
      providerFactory.setProvider(
        'autoformattingProvider',
        autoformattingProvider,
      );
    });

    it('autoformats after pressing space', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za ');

      // resolve the autoformatting
      await Promise.all(promises);

      insertText(editorView, 'after');

      expect(editorView.state.doc).toEqualDocument(doc(p('hello nice after')));
    });

    it('autoformats after pressing enter in paragraph', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za');
      sendKeyToPm(editorView, 'Enter');

      // resolve the autoformatting
      await Promise.all(promises);

      insertText(editorView, 'after');

      expect(editorView.state.doc).toEqualDocument(
        doc(p('hello nice'), p('after')),
      );
    });

    it('autoformats after pressing enter in list', async () => {
      const { editorView } = editor(doc(ul(li(p('hello {<>}')))));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za');
      sendKeyToPm(editorView, 'Enter');

      // resolve the autoformatting
      await Promise.all(promises);

      insertText(editorView, 'after');

      expect(editorView.state.doc).toEqualDocument(
        doc(ul(li(p('hello nice')), li(p('after')))),
      );
    });

    it('does not autoformat if text changes', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za ');
      expect(promises.length).toBe(1);

      insertText(editorView, 'change', editorView.state.selection.from - 3);

      // resolve the autoformatting
      await Promise.all(promises);

      expect(editorView.state.doc).toEqualDocument(doc(p('hello changeza ')));
    });

    it('autoformats even if text before changes', async () => {
      const { editorView } = editor(doc(p('hello {<>}')));

      // await the provider to resolve
      await autoformattingProvider;
      await niceProvider.getRules();

      // should queue the format
      insertText(editorView, 'za ');

      // type before *while* the autoformat provider is still resolving
      insertText(editorView, 'before ', 1);

      // resolve the autoformatting
      await Promise.all(promises);

      expect(editorView.state.doc).toEqualDocument(
        doc(p('before hello nice ')),
      );
    });
  });

  describe('provider validation', () => {
    it('does nothing if provider rejects', async () => {
      const replacementRule = jest.fn(() => {
        return (Promise.reject('nope').catch(() => {}) as any) as Promise<
          ADFEntity
        >;
      });

      const rejectingProvider: AutoformattingProvider = {
        getRules() {
          return Promise.resolve({ za: replacementRule });
        },
      };

      // setup rejecting provider
      autoformattingProvider = Promise.resolve(rejectingProvider);
      providerFactory.setProvider(
        'autoformattingProvider',
        autoformattingProvider,
      );

      const { editorView } = editor(doc(p('hello {<>}')));
      await autoformattingProvider;
      await niceProvider.getRules();

      // trigger replacement
      insertText(editorView, 'za ');
      expect(replacementRule).toBeCalled();

      insertText(editorView, 'after');

      // text should not have changed
      expect(editorView.state.doc).toEqualDocument(doc(p('hello za after')));
    });
  });
});
