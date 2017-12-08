import * as React from 'react';
import { mount } from 'enzyme';
import { ReactRenderer } from '@atlaskit/renderer';
import { JSONTransformer } from '@atlaskit/editor-json-transformer';
import { testData as emojiTestData } from '@atlaskit/emoji/dist/es5/support';
import { storyData as mentionStoryData } from '@atlaskit/mention/dist/es5/support';
import {
  Editor,
  EditorContext,
  WithEditorActions,
} from '@atlaskit/editor-core';
import {
  storyMediaProviderFactory,
  randomId,
} from '@atlaskit/editor-test-helpers';

import { name } from '../../package.json';
import { defaultSchema } from '../../src/schema/default-schema';
import referenceDoc from './_reference-doc';

describe(`${name}/default schema integration`, () => {
  let rafStub;

  beforeAll(() => {
    // This is required to enable @atlaskit/size-detector to render Editor chrome
    rafStub = jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(handler => handler());
  });

  afterAll(() => {
    rafStub.restoreMock();
  });

  describe('reference document', () => {
    const pmDoc = referenceDoc();
    const jsonDoc = new JSONTransformer().encode(pmDoc);
    expect(typeof jsonDoc).toBe('object');
    expect(jsonDoc.content.length).toBeGreaterThan(0);

    it('round-trips through <Editor /> and yields the same JSON structure', done => {
      const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
      const mediaProvider = storyMediaProviderFactory({
        collectionName: testCollectionName,
        includeUserAuthProvider: true,
      });

      const onReady = actions => {
        actions.getValue().then(receivedJsonDoc => {
          expect(typeof receivedJsonDoc).toBe('object');
          expect(receivedJsonDoc).toEqual(jsonDoc);
          done();
        });
      };

      const commentEditor = mount(
        <EditorContext>
          <WithEditorActions
            render={actions => (
              <Editor
                appearance="comment"
                allowTextFormatting={true}
                allowCodeBlocks={true}
                allowTasksAndDecisions={true}
                allowLists={true}
                allowHyperlinks={true}
                allowTextColor={true}
                allowConfluenceInlineComment={true}
                allowExtension={true}
                allowPanel={true}
                allowMentions={true}
                allowTables={true}
                allowUnsupportedContent={true}
                allowHelpDialog={true}
                allowJiraIssue={true}
                mediaProvider={mediaProvider}
                emojiProvider={emojiTestData.getEmojiResourcePromise()}
                mentionProvider={Promise.resolve(
                  mentionStoryData.resourceProvider,
                )}
                waitForMediaUpload={false}
                defaultValue={jsonDoc}
                onReady={() => onReady(actions)}
              />
            )}
          />
        </EditorContext>,
      );
      expect(commentEditor).not.toEqual(undefined);
    });

    it('validates against ADF document schema', () => {});

    it('fully renders in <Renderer /> with implicit schema', () => {
      let stats;
      const renderer = mount(
        <ReactRenderer
          document={jsonDoc}
          onComplete={s => {
            stats = s;
          }}
        />,
      );
      expect(stats.unknownInlineNodes).toEqual(0);
      expect(stats.unknownBlockNodes).toEqual(0);
      renderer.unmount();
    });

    it('fully renders in <Renderer /> with schema passed via props', () => {
      let stats;
      const renderer = mount(
        <ReactRenderer
          document={jsonDoc}
          schema={defaultSchema}
          onComplete={s => {
            stats = s;
          }}
        />,
      );
      expect(stats.unknownInlineNodes).toEqual(0);
      expect(stats.unknownBlockNodes).toEqual(0);
      renderer.unmount();
    });

    describe('contains all known node types', () => {
      const hasNode = (doc, typeName) =>
        doc.type === typeName ||
        doc.content.some(
          node =>
            node.type === typeName || (node.content && hasNode(node, typeName)),
        );

      for (let nodeName in defaultSchema.nodes) {
        it(`${nodeName}`, () => {
          expect(hasNode(jsonDoc, nodeName)).toBeTruthy();
        });
      }
    });

    describe('contains all known mark types', () => {
      const hasMark = (node, typeName) =>
        (node.marks && node.marks.some(mark => mark.type === typeName)) ||
        (node.content && node.content.some(child => hasMark(child, typeName)));

      for (let markName in defaultSchema.marks) {
        if (markName.match(/^__/)) {
          continue; // prosemirror injects some internal marks to schema
        }
        it(`${markName}`, () => {
          expect(hasMark(jsonDoc, markName)).toBeTruthy();
        });
      }
    });
  });
});
