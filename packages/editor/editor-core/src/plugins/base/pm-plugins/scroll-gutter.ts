import { Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { findFarthestParentNode } from '../../../utils';

export const GUTTER_SIZE_IN_PX = 96; // Gutter size + Custom component size
const THRESHOLD = 24; // Threshold to auto scroll the view into the gutter space

const findNonDocRootNode = findFarthestParentNode(
  node => node.type.name !== 'doc',
);

function createGutter() {
  const $gutter = document.createElement('div');
  $gutter.style.paddingBottom = `${GUTTER_SIZE_IN_PX}px`;
  let withGutter = false;
  let currentParent: HTMLElement | null = null;
  return {
    addGutter(parent: HTMLElement) {
      if (parent) {
        currentParent = parent;
        parent.appendChild($gutter);
        withGutter = true;
      }
    },
    removeGutter() {
      if (currentParent && withGutter) {
        withGutter = false;
        currentParent.removeChild($gutter);
      }
    },
    isMounted() {
      return withGutter;
    },
  };
}

export default (appearance?: string) => {
  const gutter = createGutter();

  return new Plugin({
    view(view: EditorView) {
      return {
        update() {
          if (appearance === 'full-page') {
            if (!view.state.selection.empty) {
              return; // We dont handle selection
            }
            // We calculate non doc root to know the real bottom position of components like table, where focused dom bottom is not related to the editor.
            const nonDocRootNode = findNonDocRootNode(view.state.selection);

            if (!nonDocRootNode) {
              return;
            }
            const { dom: editorRootDom } = view;

            const nonDocRootDom = view.domAtPos(nonDocRootNode.pos)
              .node as HTMLElement;
            const cursorDom = view.domAtPos(view.state.selection.$from.pos)
              .node as HTMLElement;
            const scrollContainer = (editorRootDom as HTMLElement)
              .offsetParent as HTMLElement;

            if (
              scrollContainer &&
              nonDocRootDom &&
              nonDocRootDom.getBoundingClientRect &&
              cursorDom &&
              cursorDom.getBoundingClientRect
            ) {
              const {
                scrollTop: scrollContainerTop,
                scrollHeight: scrollContainerScrollHeight,
                offsetHeight: scrollContainerOffsetHeight,
                offsetTop: scrollContainerOffsetTop,
              } = scrollContainer;

              // Check if the content is higher enough, if not return
              const {
                bottom: nonDocRootBottom,
              } = nonDocRootDom.getBoundingClientRect();

              const {
                bottom: scrollContainerBottom,
              } = scrollContainer.getBoundingClientRect();

              const {
                height: editorRootHeight,
              } = editorRootDom.getBoundingClientRect();

              // We need to check if the current editor has enough content, if we dont do this we well force a scroll on a empty document.
              const currentContentIsHigherEnough =
                nonDocRootBottom + GUTTER_SIZE_IN_PX >= scrollContainerBottom ||
                editorRootHeight + GUTTER_SIZE_IN_PX >=
                  scrollContainerOffsetHeight;

              if (!currentContentIsHigherEnough) {
                gutter.removeGutter();
                return;
              }

              // Check if scroll is in the right position, if not return
              const scrollIsInRightPosition =
                scrollContainerTop ===
                scrollContainerScrollHeight - scrollContainerOffsetHeight;

              if (scrollIsInRightPosition) {
                return;
              }

              // Check if cursor is in the right position, if not return
              const { top: cursorTop } = cursorDom.getBoundingClientRect();
              const cursorPosition =
                cursorTop + scrollContainerTop + scrollContainerOffsetTop;

              const cursorIsAtTheEnd =
                cursorPosition >= scrollContainerScrollHeight - THRESHOLD;

              if (!cursorIsAtTheEnd) {
                return;
              }

              // Check if scroll is at end, if not return
              const scrollIsAtEnd =
                scrollContainerOffsetHeight + scrollContainerTop >=
                scrollContainerScrollHeight - GUTTER_SIZE_IN_PX - THRESHOLD;

              if (!scrollIsAtEnd) {
                return;
              }

              if (!gutter.isMounted()) {
                gutter.addGutter(editorRootDom.parentElement!);
              }

              // If I reach here is because I should scroll to the end of the document
              scrollContainer.scrollTo({
                left: 0,
                top: scrollContainerScrollHeight - scrollContainerOffsetHeight,
              });
            }
          }
        },
      };
    },
  });
};
