import {
  createEditorFactory,
  doc,
  p,
  emoji,
  table,
  tr,
  td,
  tdEmpty,
} from '@atlaskit/editor-test-helpers';

import { emoji as emojiData } from '@atlaskit/util-data-test';
import { inlineCursorTargetStateKey } from '../../../../plugins/base/pm-plugins/inline-cursor-target';
import { ProviderFactory } from '@atlaskit/editor-common';

const emojiProvider = emojiData.testData.getEmojiResourcePromise();
const providerFactory = ProviderFactory.create({ emojiProvider });

describe('Inline cursor target', () => {
  const createEditor = createEditorFactory();
  const editorFactory = (doc: any) =>
    createEditor({
      doc,
      editorProps: {
        emojiProvider,
        allowTables: true,
      },
      providerFactory,
      pluginKey: inlineCursorTargetStateKey,
    });

  it(`should give positions at the current pos when NOT at the end of a 'special' node`, () => {
    const { pluginState, sel } = editorFactory(
      doc(
        table()(
          tr(
            tdEmpty,
            td()(
              p(
                emoji({ shortName: ':smiley:' })(),
                '{<>}',
                ' / ',
                emoji({ shortName: ':smiley:' })(),
              ),
            ),
            tdEmpty,
          ),
        ),
      ),
    );

    expect(pluginState.positions[0]).toEqual(sel - 1);
  });

  it(`should give positions at the current pos when at the end of a 'special' node`, () => {
    const { pluginState, sel } = editorFactory(
      doc(
        table()(
          tr(
            tdEmpty,
            td()(
              p(
                emoji({ shortName: ':smiley:' })(),
                ' / ',
                emoji({ shortName: ':smiley:' })(),
                '{<>}',
              ),
            ),
            tdEmpty,
          ),
        ),
      ),
    );

    expect(pluginState.positions[0]).toEqual(sel - 1);
  });
});
