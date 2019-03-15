import { EditorView } from 'prosemirror-view';

export type EditorViewWithComposition = EditorView & {
  domObserver: {
    observer?: MutationObserver;
    flush: () => void;
  };
  composing: boolean;
};
