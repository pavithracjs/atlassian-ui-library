import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';

/*
  Inline Comments Component public API
*/
export type InlineCommentComponentProps = {
  /* annotation id (provided when viewing comment) */
  markerRef?: string;

  /* selected text (provided when creating comment) */
  textSelection?: string;

  /* DOM element having annotation (for positioning) */
  dom?: HTMLElement;

  /* callbacks */
  onSuccess: (id: string) => void;
  onDelete: (id: string) => void;

  /*
    Since the Editor loses focus when the actual comment is being made,
    we need to add a temporary mark in ProseMirror to show the selection 
    to the user. If the user dismisses the comment creation, the query mark 
    must be removed in the Editor using this callback
  */
  onCancel: () => void;
};

/*
  Reactions Component public API
*/
export type ReactionComponentProps = {
  // Coming later!
};

export interface AnnotationProvider {
  /* 
    Products can choose to have their own component for handling inline comments (and in a future release, reactions).
    We provide ExampleInlineCommentsComponent in the examples as reference implementation.
  */
  inlineCommentComponent?: React.ComponentType<InlineCommentComponentProps>;
  reactionComponent?: React.ComponentType<ReactionComponentProps>;
}

// actions
export enum AnnotationToolbarAction {
  SELECTION_CHANGE = 'SELECTION_CHANGE',
}

export enum AnnotationToolbarStateName {
  EDIT_ANNOTATION_TOOLBAR = 'EDIT_ANNOTATION_TOOLBAR',
}

export type EditAnnotationState = {
  type: AnnotationToolbarStateName.EDIT_ANNOTATION_TOOLBAR;
  pos: number;
  node: PMNode;
};

export type AnnotationToolbarState = EditAnnotationState | undefined;
