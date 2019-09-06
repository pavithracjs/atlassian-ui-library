export { Refs } from './schema-builder';
export * from './base64fileconverter';
export { default as sendKeyToPm } from './send-key-to-pm';
export { default as chaiPlugin } from './chai';
export { default as createEvent } from './create-event';
export { default as dispatchPasteEvent } from './dispatch-paste-event';
export {
  default as createEditorFactory,
  Options as CreateEditorOptions,
} from './create-editor';
export {
  default as createAnalyticsEventMock,
} from './create-analytics-event-mock';
export { default as fixtures } from './fixtures';
export { default as simulatePlatform, Platforms } from './simulatePlatform';
export { default as patchEditorViewForJSDOM, Image } from './jsdom-fixtures';
export * from './transactions';
export {
  doc,
  p,
  blockquote,
  code_block,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  li,
  ul,
  ol,
  br,
  img,
  hr,
  em,
  breakout,
  strong,
  code,
  a,
  underline,
  subsup,
  strike,
  text,
  fragment,
  slice,
  mention,
  emoji,
  nodeFactory,
  markFactory,
  BuilderContent,
  coerce,
  offsetRefs,
  panel,
  panelNote,
  hardBreak,
  typeAheadQuery,
  media,
  mediaGroup,
  mediaSingle,
  textColor,
  table,
  tr,
  td,
  th,
  tdEmpty,
  tdCursor,
  thEmpty,
  thCursor,
  decisionItem,
  decisionList,
  taskItem,
  taskList,
  confluenceJiraIssue,
  confluenceUnsupportedBlock,
  confluenceUnsupportedInline,
  confluenceInlineComment,
  inlineExtension,
  bodiedExtension,
  extension,
  RefsNode,
  RefsTracker,
  sequence,
  date,
  placeholder,
  layoutSection,
  layoutColumn,
  inlineCard,
  blockCard,
  clean,
  cleanOne,
  status,
  alignment,
  indentation,
  annotation,
  unsupportedBlock,
  unsupportedInline,
  builderEval,
} from './schema-builder';
export { default as defaultSchema } from './schema';
export * from './html-helpers';
export { storyMediaProviderFactory, fakeMediaProvider } from './media-provider';
export { activityProviderFactory } from './activity-provider';
export {
  storyContextIdentifierProviderFactory,
} from './context-identifier-provider';
export { default as randomId } from './random-id';
export { default as sleep } from './sleep';
export { isMobileBrowser } from './device';
export { default as spyOnReturnValue } from './spy-on-return-value';
export { macroProvider, MockMacroProvider } from './mock-macro-provider';
export { customInsertMenuItems } from './mock-insert-menu';
export {
  inlineExtensionData,
  extensionData,
  bodiedExtensionData,
} from './mock-extension-data';
export * from './schema-element-builder';
export { cardProvider, EditorTestCardProvider } from './card-provider';
export * from './enzyme';
export { compareSelection } from './selection';
export * from './table';
export * from './constants';
export { autoformattingProvider } from './autoformatting-provider';
export { extensionHandlers } from './extensions';
export { analyticsClient } from './analytics-client-mock';
export {
  default as ExampleInlineCommentComponent,
} from './ExampleInlineCommentComponent';

export const testMediaFileId = 'a559980d-cd47-43e2-8377-27359fcb905f';
