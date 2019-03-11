import {
  ACTION,
  INPUT_METHOD,
  EVENT_TYPE,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  AnalyticsEventPayload,
  addAnalytics,
  PASTE_ACTION_SUBJECT_ID,
  PasteType,
  PasteSource,
  PasteContent,
  PasteTypes,
  PasteContents,
  withAnalytics,
} from '../../analytics';
import { commandWithAnalytics as commandWithV2Analytics } from '../../../analytics';
import { EditorView } from 'prosemirror-view';
import { Slice, Node } from 'prosemirror-model';
import { getPasteSource } from '../util';
import {
  handlePasteAsPlainText,
  handlePasteIntoTaskAndDecision,
  handleCodeBlock,
  handleMediaSingle,
  handlePastePreservingMarks,
  handleMarkdown,
  handleRichText,
} from '../handlers';
import { Command } from '../../../types';
import { pipe } from '../../../utils';
import { EditorState } from 'prosemirror-state';
import { findParentNode } from 'prosemirror-utils';

type PasteContext = {
  type: PasteType;
  asPlain?: boolean;
};

type PastePayloadAttributes = {
  pasteSize: number;
  type: PasteType;
  content: PasteContent;
  source: PasteSource;
};

function getContent(state: EditorState, slice: Slice): PasteContent {
  const nameOfNode = new Set<string>();
  slice.content.forEach((node: Node) => nameOfNode.add(node.type.name));

  if (nameOfNode.size > 1) {
    return PasteContents.mixed;
  }

  if (nameOfNode.size === 0) {
    return PasteContents.uncategorized;
  }

  const nodeName = nameOfNode.values().next().value;
  switch (nodeName) {
    case 'parragraph': {
      return PasteContents.text;
    }
    case 'bulletList': {
      return PasteContents.bulletList;
    }
    case 'orderedList': {
      return PasteContents.orderedList;
    }
    case 'heading': {
      return PasteContents.heading;
    }
    case 'blockquote': {
      return PasteContents.blockquote;
    }
    case 'codeBlock': {
      return PasteContents.codeBlock;
    }
    case 'panel': {
      return PasteContents.panel;
    }
    case 'rule': {
      return PasteContents.rule;
    }
    case 'mediaGroup': {
      return PasteContents.mediaGroup;
    }
    case 'mediaSingle': {
      return PasteContents.mediaSingle;
    }
    case 'table': {
      return PasteContents.table;
    }
    case 'tableCells': {
      return PasteContents.tableCells;
    }
    case 'tableHeader': {
      return PasteContents.tableHeader;
    }
    case 'tableRow': {
      return PasteContents.tableRow;
    }
    case 'decisionList': {
      return PasteContents.decisionList;
    }
    case 'decisionItem': {
      return PasteContents.decisionItem;
    }
    case 'taskItem': {
      return PasteContents.taskItem;
    }
    case 'extension': {
      return PasteContents.extension;
    }
    case 'bodiedExtension': {
      return PasteContents.bodiedExtension;
    }
    case 'blockCard': {
      return PasteContents.blockCard;
    }
    default: {
      return PasteContents.uncategorized;
    }
  }
}

function getActionSubjectId(view: EditorView): PASTE_ACTION_SUBJECT_ID {
  const {
    state: {
      selection,
      schema: {
        nodes: { paragraph, listItem, taskItem, decisionItem },
      },
    },
  } = view;
  const parent = findParentNode((node: Node) => {
    if (
      node.type !== paragraph &&
      node.type !== listItem &&
      node.type !== taskItem &&
      node.type !== decisionItem
    ) {
      return true;
    }
    return false;
  })(selection);

  if (!parent) {
    return ACTION_SUBJECT_ID.PASTE_PARAGRAPH;
  }
  const parentType = parent.node.type;
  switch (parentType.name) {
    case 'blockquote': {
      return ACTION_SUBJECT_ID.PASTE_BLOCKQUOTE;
    }
    case 'blockCard': {
      return ACTION_SUBJECT_ID.PASTE_BLOCK_CARD;
    }
    case 'bodiedExtension': {
      return ACTION_SUBJECT_ID.PASTE_BODIED_EXTENSION;
    }
    case 'bulletList': {
      return ACTION_SUBJECT_ID.PASTE_BULLET_LIST;
    }
    case 'codeBlock': {
      return ACTION_SUBJECT_ID.PASTE_CODE_BLOCK;
    }
    case 'decisionList': {
      return ACTION_SUBJECT_ID.PASTE_DECISION_LIST;
    }
    case 'extension': {
      return ACTION_SUBJECT_ID.PASTE_EXTENSION;
    }
    case 'heading': {
      return ACTION_SUBJECT_ID.PASTE_HEADING;
    }
    case 'mediaGroup': {
      return ACTION_SUBJECT_ID.PASTE_MEDIA_GROUP;
    }
    case 'mediaSingle': {
      return ACTION_SUBJECT_ID.PASTE_MEDIA_SINGLE;
    }
    case 'orderedList': {
      return ACTION_SUBJECT_ID.PASTE_ORDERED_LIST;
    }
    case 'panel': {
      return ACTION_SUBJECT_ID.PASTE_PANEL;
    }
    case 'rule': {
      return ACTION_SUBJECT_ID.PASTE_RULE;
    }
    case 'table': {
      return ACTION_SUBJECT_ID.PASTE_TABLE;
    }
    case 'tableCell': {
      return ACTION_SUBJECT_ID.PASTE_TABLE_CELL;
    }
    case 'tableHeader': {
      return ACTION_SUBJECT_ID.PASTE_TABLE_HEADER;
    }
    case 'tableRow': {
      return ACTION_SUBJECT_ID.PASTE_TABLE_ROW;
    }
    case 'taskList': {
      return ACTION_SUBJECT_ID.PASTE_TASK_LIST;
    }
    default: {
      return ACTION_SUBJECT_ID.PASTE_PARAGRAPH;
    }
  }
}

function createPasteAsPlainPayload(
  actionSubjectId: PASTE_ACTION_SUBJECT_ID,
  text: string,
): AnalyticsEventPayload {
  return {
    action: ACTION.PASTED_AS_PLAIN,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.KEYBOARD,
      pasteSize: text.length,
    },
  };
}

function createPastePayload(
  actionSubjectId: PASTE_ACTION_SUBJECT_ID,
  attributes: PastePayloadAttributes,
): AnalyticsEventPayload {
  return {
    action: ACTION.PASTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.KEYBOARD,
      ...attributes,
    },
  };
}

export function createPasteAnalyticsPayload(
  view: EditorView,
  event: ClipboardEvent,
  slice: Slice,
  pasteContext: PasteContext,
): AnalyticsEventPayload {
  const text = event.clipboardData.getData('text/plain');

  const actionSubjectId = getActionSubjectId(view);

  if (pasteContext.asPlain) {
    return createPasteAsPlainPayload(actionSubjectId, text);
  }

  const source = getPasteSource(event);

  if (pasteContext.type === PasteTypes.plain) {
    return createPastePayload(actionSubjectId, {
      pasteSize: text.length,
      type: pasteContext.type,
      content: PasteContents.text,
      source,
    });
  }

  const pasteSize = slice.size;
  const content = getContent(view.state, slice);

  return createPastePayload(actionSubjectId, {
    type: pasteContext.type,
    pasteSize,
    content,
    source,
  });
}

// TODO: We should not dispatch only analytics, it's preferred to wrap each command with his own analytics.
// However, must of the command used in paste, dispatch multiple time,
// so it makes hard to wrap each command into his own analytics.
export function sendPasteAnalyticsEvent(
  view: EditorView,
  event: ClipboardEvent,
  slice: Slice,
  pasteContext: PasteContext,
) {
  const payload = createPasteAnalyticsPayload(view, event, slice, pasteContext);

  view.dispatch(addAnalytics(view.state.tr, payload));
}

export function pasteCommandWithAnalytics(
  view: EditorView,
  event: ClipboardEvent,
  slice: Slice,
  pasteContext: PasteContext,
) {
  return withAnalytics(() =>
    createPasteAnalyticsPayload(view, event, slice, pasteContext),
  );
}

export const handlePasteAsPlainTextWithAnalytics = (
  view: EditorView,
  event: ClipboardEvent,
  slice: Slice,
): Command =>
  pipe(
    handlePasteAsPlainText,
    pasteCommandWithAnalytics(view, event, slice, {
      type: PasteTypes.plain,
      asPlain: true,
    }),
    commandWithV2Analytics('atlassian.editor.paste.alt', {
      source: getPasteSource(event),
    }),
  )(slice, event);

export const handlePasteIntoTaskAndDecisionWithAnalytics = (
  view: EditorView,
  event: ClipboardEvent,
  slice: Slice,
  type: PasteType,
): Command =>
  pipe(
    handlePasteIntoTaskAndDecision,
    commandWithV2Analytics('atlassian.fabric.action-decision.editor.paste'),
    pasteCommandWithAnalytics(view, event, slice, {
      type: type,
    }),
  )(slice);

export const handleCodeBlockWithAnalytics = (
  view: EditorView,
  event: ClipboardEvent,
  slice: Slice,
  text: string,
): Command =>
  pipe(
    handleCodeBlock,
    pasteCommandWithAnalytics(view, event, slice, {
      type: PasteTypes.plain,
    }),
  )(text);

export const handleMediaSingleWithAnalytics = (
  view: EditorView,
  event: ClipboardEvent,
  slice: Slice,
  type: PasteType,
): Command =>
  pipe(
    handleMediaSingle,
    commandWithV2Analytics('atlassian.editor.paste', {
      source: getPasteSource(event),
    }),
    pasteCommandWithAnalytics(view, event, slice, {
      type,
    }),
  )(slice);

export const handlePastePreservingMarksWithAnalytics = (
  view: EditorView,
  event: ClipboardEvent,
  slice: Slice,
  type: PasteType,
): Command => {
  let withV2Analytics = commandWithV2Analytics('atlassian.editor.paste', {
    source: getPasteSource(event),
  });

  if (type === PasteTypes.markdown) {
    withV2Analytics = commandWithV2Analytics('atlassian.editor.markdown');
  }

  return pipe(
    handlePastePreservingMarks,
    withV2Analytics,
    pasteCommandWithAnalytics(view, event, slice, {
      type,
    }),
  )(slice);
};

export const handleMarkdownWithAnalytics = (
  view: EditorView,
  event: ClipboardEvent,
  slice: Slice,
): Command =>
  pipe(
    handleMarkdown,
    commandWithV2Analytics('atlassian.editor.markdown'),
    pasteCommandWithAnalytics(view, event, slice, {
      type: PasteTypes.markdown,
    }),
  )(slice);

export const handleRichTextWithAnalytics = (
  view: EditorView,
  event: ClipboardEvent,
  slice: Slice,
): Command =>
  pipe(
    handleRichText,
    commandWithV2Analytics('atlassian.editor.paste', {
      source: getPasteSource(event),
    }),
    pasteCommandWithAnalytics(view, event, slice, {
      type: PasteTypes.richText,
    }),
  )(slice);
