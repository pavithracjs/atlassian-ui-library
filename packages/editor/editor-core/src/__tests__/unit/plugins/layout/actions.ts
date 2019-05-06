import {
  layoutSection,
  layoutColumn,
  doc,
  p,
  createEditorFactory,
} from '@atlaskit/editor-test-helpers';
import {
  deleteActiveLayoutNode,
  setPresetLayout,
  getPresetLayout,
  PresetLayout,
} from '../../../../plugins/layout/actions';
import { layouts, buildLayoutForWidths } from './_utils';

describe('layout actions', () => {
  const createEditor = createEditorFactory();
  const editor = (doc: any) =>
    createEditor({ doc, editorProps: { allowLayouts: true } });

  describe('#getPresetLayout', () => {
    const getLayoutForWidths = (widths: number[]): PresetLayout | undefined => {
      const { editorView } = editor(doc(p('')));
      const section = buildLayoutForWidths(widths);
      return getPresetLayout(section(editorView.state.schema));
    };

    describe('detecting exact layout', () => {
      layouts.forEach(layout => {
        it(`should detect "${layout.name}" layout`, () => {
          expect(getLayoutForWidths(layout.widths)).toBe(layout.name);
        });
      });
    });
  });

  describe('#setPresetLayout', () => {
    layouts.forEach(currentLayout => {
      layouts.forEach(newLayout => {
        if (currentLayout.name !== newLayout.name) {
          it(`handles switching from "${currentLayout.name}" to "${
            newLayout.name
          }"`, () => {
            const { editorView } = editor(
              doc(buildLayoutForWidths(currentLayout.widths, true)),
            );
            setPresetLayout(newLayout.name)(
              editorView.state,
              editorView.dispatch,
            );
            expect(editorView.state.doc).toEqualDocument(
              doc(buildLayoutForWidths(newLayout.widths)),
            );
          });
        }
      });
    });

    it('should do nothing if selection not in layout', () => {
      const { editorView } = editor(doc(p('')));
      expect(
        setPresetLayout('three_equal')(editorView.state, editorView.dispatch),
      ).toBe(false);
    });
  });

  describe('#deleteActiveLayout', () => {
    it('should delete active layoutSection', () => {
      const { editorView } = editor(
        doc(
          layoutSection(
            layoutColumn({ width: 50 })(p('{<>}')),
            layoutColumn({ width: 50 })(p('')),
          ),
        ),
      );
      deleteActiveLayoutNode(editorView.state, editorView.dispatch);
      expect(editorView.state.doc).toEqualDocument(doc(p('')));
    });

    it('should do nothing if selection not in layout', () => {
      const { editorView } = editor(doc(p('')));
      expect(
        setPresetLayout('three_equal')(editorView.state, editorView.dispatch),
      ).toBe(false);
    });
  });
});
