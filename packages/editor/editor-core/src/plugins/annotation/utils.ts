import { Node } from 'prosemirror-model';
import { EditorState, TextSelection, Transaction } from 'prosemirror-state';

export function canAnnotationBeCreatedInRange(from: number, to: number) {
  return (state: EditorState) => {
    const {
      schema: {
        marks: { annotation: annotationMark },
      },
    } = state;

    if (!state.doc.rangeHasMark(from, to, annotationMark)) {
      const $from = state.doc.resolve(from);
      const $to = state.doc.resolve(to);

      if (
        $from.parent === $to.parent &&
        $from.parent.isTextblock &&
        $from.parent.type.allowsMarkType(annotationMark)
      ) {
        let allowed = true;
        state.doc.nodesBetween(from, to, node => {
          allowed =
            allowed && !node.marks.some(m => m.type.excludes(annotationMark));
          return allowed;
        });
        return allowed;
      }
    }

    return false;
  };
}

export function isSelectionInsideAnnotation(
  stateOrTr: EditorState | Transaction,
) {
  return !!stateOrTr.doc.type.schema.marks.annotation.isInSet(
    stateOrTr.selection.$from.marks(),
  );
}

export function isSelectionAroundAnnotation(
  stateOrTr: EditorState | Transaction,
) {
  const {
    selection: { $from, $to },
  } = stateOrTr;
  const node = $from.nodeAfter;

  return (
    !!node &&
    $from.textOffset === 0 &&
    $to.pos - $from.pos === node.nodeSize &&
    !!stateOrTr.doc.type.schema.marks.annotation.isInSet(node.marks)
  );
}

export function getActiveAnnotationMark(
  state: EditorState | Transaction,
): { node: Node; pos: number } | undefined {
  const {
    selection: { $from },
  } = state;

  if (
    isSelectionInsideAnnotation(state) ||
    isSelectionAroundAnnotation(state)
  ) {
    const pos = $from.pos - $from.textOffset;
    const node = state.doc.nodeAt(pos) as Node;
    return node && node.isText ? { node, pos } : undefined;
  }

  return undefined;
}

export function getActiveText(state: EditorState): string | undefined {
  const { selection, tr } = state;

  if (selection instanceof TextSelection) {
    const { $from, from, to } = selection;
    const node = tr.doc.nodeAt(from);

    if (node && node.isText) {
      return node.textContent.substr($from.textOffset, to - from);
    }
  }

  return;
}
