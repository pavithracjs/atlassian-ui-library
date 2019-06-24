import { createEditorFactory, doc, p } from '@atlaskit/editor-test-helpers';
import { EditorView } from 'prosemirror-view';
import { buildLayoutForWidths } from '../../layout/_utils';
import { calcMediaPxWidth } from '../../../../../plugins/media/utils/media-single';

describe('Media Single Utils', () => {
  const createEditor = createEditorFactory();

  const containerWidth = { width: 1920, lineLength: 760 };

  const editor = (doc: any) =>
    createEditor({
      doc,
      editorProps: { allowLayouts: true },
    });

  describe('calcMediaPxWidth', () => {
    let editorView: EditorView;
    let sel: number;
    const calcWidth = (opts = {}): number =>
      calcMediaPxWidth({
        origWidth: 100,
        origHeight: 100,
        state: editorView.state,
        containerWidth,
        pos: sel,
        ...opts,
      });

    beforeEach(() => {
      ({ editorView, sel } = editor(doc(p('{<>}'))));
    });

    describe('wide media', () => {
      it('calculates correct width when smaller than line length', () => {
        const width = calcWidth({
          layout: 'wide',
        });
        expect(width).toBe(1011); // line length * wide ratio (1.33)
      });

      it('calculates correct width when bigger than page width', () => {
        const width = calcWidth({
          layout: 'wide',
          containerWidth: { width: 600, lineLength: 760 },
        });
        expect(width).toBe(760); // defaults to line length
      });
    });

    describe('full-width media', () => {
      it('calculates correct width for media', () => {
        const width = calcWidth({
          layout: 'full-width',
        });
        expect(width).toBe(1824); // width - breakout padding
      });
    });

    describe('aligned media', () => {
      it('calculates correct width for media when smaller than 50% line length', () => {
        const width = calcWidth({
          layout: 'align-start',
        });
        expect(width).toBe(100); // original width
      });

      it('calculates correct width for media when bigger than 50% line length', () => {
        const width = calcWidth({
          origWidth: 2000,
          layout: 'align-start',
        });
        expect(width).toBe(380); // 50% of line length
      });
    });

    describe('resized media', () => {
      /**
       * Percentage means percent of line length, not percent of image
       * For sizes < 100% there is a gutter taken into account for the resize handles
       */

      describe('full-width mode', () => {
        [
          { pct: 20, px: 341 },
          { pct: 40, px: 706 },
          { pct: 60, px: 1071 },
          { pct: 80, px: 1436 },
          { pct: 100, px: 1800 },
        ].forEach(size => {
          it(`calculates correct width for media resized to ${
            size.pct
          }%`, () => {
            const width = calcWidth({
              pctWidth: size.pct,
              isFullWidthModeEnabled: true,
              containerWidth: { width: 1920, lineLength: 1800 },
            });
            expect(width).toBe(size.px);
          });
        });
      });

      describe('fixed-width mode', () => {
        [
          { pct: 20, px: 133 },
          { pct: 40, px: 290 },
          { pct: 60, px: 447 },
          { pct: 80, px: 604 },
          { pct: 100, px: 760 },
        ].forEach(size => {
          it(`calculates correct width for media resized to ${
            size.pct
          }%`, () => {
            const width = calcWidth({ pctWidth: size.pct });
            expect(width).toBe(size.px);
          });
        });
      });
    });

    describe('media inside layouts', () => {
      beforeEach(() => {
        ({ editorView, sel } = editor(
          doc(buildLayoutForWidths([50, 50], true)),
        ));
      });

      describe('media smaller than layout column', () => {
        describe('full-width mode', () => {
          it('calculates correct width for media', () => {
            const width = calcWidth({
              isFullWidthModeEnabled: true,
              containerWidth: { width: 1920, lineLength: 1800 },
            });
            expect(width).toBe(100); // original width
          });

          it('calculates correct width for resized media', () => {
            const width = calcWidth({
              isFullWidthModeEnabled: true,
              containerWidth: { width: 1920, lineLength: 1800 },
              pctWidth: 20,
            });
            expect(width).toBe(341); // 20% of line length - resize handle gutter
          });
        });

        describe('fixed-width mode', () => {
          it('calculates correct width for media', () => {
            const width = calcWidth({
              isFullWidthModeEnabled: true,
            });
            expect(width).toBe(100); // original width
          });

          it('calculates correct width for resized media', () => {
            const width = calcWidth({
              isFullWidthModeEnabled: true,
              pctWidth: 20,
            });
            expect(width).toBe(133); // 20% of line length - resize handle gutter
          });
        });
      });

      describe('media bigger than layout column', () => {
        describe('full-width mode', () => {
          it('calculates correct width for media', () => {
            const width = calcWidth({
              origWidth: 2000,
              isFullWidthModeEnabled: true,
              containerWidth: { width: 1920, lineLength: 1800 },
            });
            expect(width).toBe(883); // width of layout column
          });

          it('calculates correct width for resized media', () => {
            const width = calcWidth({
              origWidth: 2000,
              isFullWidthModeEnabled: true,
              containerWidth: { width: 1920, lineLength: 1800 },
              pctWidth: 20,
            });
            expect(width).toBe(341); // 20% of line length - resize handle gutter
          });
        });

        describe('fixed-width mode', () => {
          it('calculates correct width for media', () => {
            const width = calcWidth({
              origWidth: 2000,
            });
            expect(width).toBe(363); // width of layout column
          });

          it('calculates correct width for resized media', () => {
            const width = calcWidth({
              origWidth: 2000,
              pctWidth: 20,
            });
            expect(width).toBe(133); // 20% of line length - resize handle gutter
          });
        });
      });
    });
  });
});
