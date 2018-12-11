import * as React from 'react';
import { Editor } from '../src/index';
import EditorContext from '../src/ui/EditorContext';
import WithEditorActions from '../src/ui/WithEditorActions';
import { MentionDescription, MentionProvider } from '@atlaskit/mention';
import { EmojiProvider } from '@atlaskit/emoji';
import { mention, emoji, taskDecision } from '@atlaskit/util-data-test';
import {
  cardProvider,
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
  macroProvider,
} from '@atlaskit/editor-test-helpers';
import { exampleDocument } from '../example-helpers/example-document';

class MentionProviderImpl implements MentionProvider {
  filter(query?: string): void {}
  recordMentionSelection(mention: MentionDescription): void {}
  shouldHighlightMention(mention: MentionDescription): boolean {
    return false;
  }
  isFiltering(query: string): boolean {
    return false;
  }
  subscribe(
    key: string,
    callback?,
    errCallback?,
    infoCallback?,
    allResultsCallback?,
  ): void {}
  unsubscribe(key: string): void {}
}

export const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: true,
});

export const providers = {
  emojiProvider: emoji.storyData.getEmojiResource({
    uploadSupported: true,
    currentUser: {
      id: emoji.storyData.loggedUser,
    },
  }) as Promise<EmojiProvider>,
  mentionProvider: Promise.resolve(mention.storyData.resourceProvider),
  taskDecisionProvider: Promise.resolve(
    taskDecision.getMockTaskDecisionResource(),
  ),
  // contextIdentifierProvider: storyContextIdentifierProviderFactory(),
  // activityProvider: Promise.resolve(new MockActivityResource()),
  // macroProvider: Promise.resolve(macroProvider),
};

export function mobileEditor() {
  return (
    <EditorContext>
      <div>
        <WithEditorActions render={actions => <div />} />
        <Editor
          quickInsert={true}
          {...providers}
          appearance="mobile"
          media={{ provider: mediaProvider, allowMediaSingle: true }}
          allowLists={true}
          allowPanel={true}
          allowCodeBlocks={true}
          allowTables={{
            allowControls: false,
          }}
          allowExtension={true}
          allowTextColor={true}
          allowDate={true}
          allowRule={true}
          allowStatus={true}
          // eg. If the URL parameter is like ?mode=dark use that, otherwise check the prop (used in example)

          defaultValue={exampleDocument}
          mode={'dark'}
        />
      </div>
    </EditorContext>
  );
}

export default function Example() {
  return (
    <div>
      <p>Editor that is used by mobile applications.</p>
      {mobileEditor()}
    </div>
  );
}
