import { browser } from '@atlaskit/editor-common';
import { pluginKey } from '../../../../plugins/lists/pm-plugins/main';
import {
  createEditor,
  sendKeyToPm,
  doc,
  h1,
  ol,
  ul,
  li,
  p,
  panel,
  media,
  mediaSingle,
  randomId,
  br,
  code_block,
} from '@atlaskit/editor-test-helpers';
import {
  toggleOrderedList,
  toggleBulletList,
} from '../../../../plugins/lists/commands';
import { insertMediaAsMediaSingle } from '../../../../plugins/media/utils/media-single';
import { GapCursorSelection } from '../../../../plugins/gap-cursor';

describe('lists', () => {
  const editor = (doc: any, trackEvent?: () => {}) =>
    createEditor({
      doc,
      editorProps: {
        analyticsHandler: trackEvent,
        allowCodeBlocks: true,
        allowPanel: true,
        allowLists: true,
        media: { allowMediaSingle: true },
      },
      pluginKey,
    });

  const testCollectionName = `media-plugin-mock-collection-${randomId()}`;
  const temporaryFileId = `temporary:${randomId()}`;

  describe('keymap', () => {
    let trackEvent;
    beforeEach(() => {
      trackEvent = jest.fn();
    });

    describe('when hit enter', () => {
      it('should split list item', () => {
        const { editorView } = editor(doc(ul(li(p('text{<>}')))), trackEvent);
        sendKeyToPm(editorView, 'Enter');
        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('text')), li(p()))),
        );
      });
    });

    describe('when hit Tab', () => {
      it('should call indent analytics event', () => {
        const { editorView } = editor(
          doc(ol(li(p('text')), li(p('text{<>}')))),
          trackEvent,
        );
        sendKeyToPm(editorView, 'Tab');
        expect(trackEvent).toHaveBeenCalledWith(
          'atlassian.editor.format.list.indent.keyboard',
        );
      });
    });

    describe('when hit Backspace', () => {
      const backspaceCheck = (beforeDoc, afterDoc) => {
        const { editorView } = editor(beforeDoc);
        sendKeyToPm(editorView, 'Backspace');

        const expectedDoc = afterDoc(editorView.state.schema);
        expect(editorView.state.doc.toJSON()).toEqual(expectedDoc.toJSON());

        const { state } = editorView;
        if (expectedDoc.refs['<']) {
          expect(state.selection.from).toEqual(expectedDoc.refs['<']);
          expect(state.selection.to).toEqual(expectedDoc.refs['>']);
        } else {
          expect(state.selection.from).toEqual(expectedDoc.refs['<>']);
          expect(state.selection.empty).toBe(true);
        }
      };

      it('should outdent a first level list item to paragraph', () => {
        backspaceCheck(
          doc(ol(li(p('text')), li(p('{<>}')))),
          doc(ol(li(p('text'))), p('{<>}')),
        );
      });

      it('should outdent a first level list item to paragraph, with content', () => {
        backspaceCheck(
          doc(ol(li(p('text')), li(p('{<>}second text')))),
          doc(ol(li(p('text'))), p('{<>}second text')),
        );
      });

      it('should outdent a second level list item to first level', () => {
        backspaceCheck(
          doc(ol(li(p('text'), ol(li(p('{<>}')))))),
          doc(ol(li(p('text')), li(p('{<>}')))),
        );
      });

      it('should outdent a second level list item to first level, with content', () => {
        backspaceCheck(
          doc(ol(li(p('text'), ol(li(p('{<>}subtext')))))),
          doc(ol(li(p('text')), li(p('{<>}subtext')))),
        );
      });

      it('should move paragraph content back to previous (nested) list item', () => {
        backspaceCheck(
          doc(ol(li(p('text'), ol(li(p('text'))))), p('{<>}after')),
          doc(ol(li(p('text'), ol(li(p('text{<>}after')))))),
        );
      });

      it('keeps nodes same level as backspaced list item together in same list', () => {
        backspaceCheck(
          doc(
            ol(li(p('{<>}A'), ol(li(p('B')))), li(p('C'))),

            p('after'),
          ),
          doc(
            p('{<>}A'),
            ol(li(p('B')), li(p('C'))),

            p('after'),
          ),
        );
      });

      it('merges two single-level lists when the middle paragraph is backspaced', () => {
        backspaceCheck(
          doc(
            ol(li(p('A')), li(p('B'))),

            p('{<>}middle'),

            ol(li(p('C')), li(p('D'))),
          ),
          doc(ol(li(p('A')), li(p('B{<>}middle')), li(p('C')), li(p('D')))),
        );
      });

      it('merges two double-level lists when the middle paragraph is backspaced', () => {
        backspaceCheck(
          doc(
            ol(li(p('A'), ol(li(p('B')))), li(p('C'))),

            p('{<>}middle'),

            ol(li(p('D'), ol(li(p('E')))), li(p('F'))),
          ),
          doc(
            ol(
              li(p('A'), ol(li(p('B')))),
              li(p('C{<>}middle')),
              li(p('D'), ol(li(p('E')))),
              li(p('F')),
            ),
          ),
        );
      });

      it('moves directly to previous list item if it was empty', () => {
        backspaceCheck(
          doc(
            ol(li(p('nice')), li(p('')), li(p('{<>}text'))),

            p('after'),
          ),
          doc(
            ol(li(p('nice')), li(p('{<>}text'))),

            p('after'),
          ),
        );
      });

      it('moves directly to previous list item if it was empty, but with two paragraphs', () => {
        backspaceCheck(
          doc(
            ol(li(p('nice')), li(p('')), li(p('{<>}text'), p('double'))),

            p('after'),
          ),
          doc(
            ol(li(p('nice')), li(p('{<>}text'), p('double'))),

            p('after'),
          ),
        );
      });

      it('backspaces paragraphs within a list item rather than the item itself', () => {
        backspaceCheck(
          doc(
            ol(li(p('')), li(p('nice'), p('{<>}two'))),

            p('after'),
          ),
          doc(
            ol(li(p('')), li(p('nice{<>}two'))),

            p('after'),
          ),
        );
      });

      it('backspaces line breaks correctly within list items, with content after', () => {
        backspaceCheck(
          doc(
            ol(li(p('')), li(p('nice'), p('two', br(), '{<>}three'))),

            p('after'),
          ),
          doc(
            ol(li(p('')), li(p('nice'), p('two{<>}three'))),

            p('after'),
          ),
        );
      });

      it('backspaces line breaks correctly within list items, with content before', () => {
        backspaceCheck(
          doc(
            ol(li(p('')), li(p('nice'), p('two', br(), br(), '{<>}'))),

            p('after'),
          ),
          doc(
            ol(li(p('')), li(p('nice'), p('two', br(), '{<>}'))),

            p('after'),
          ),
        );
      });

      it('moves text from after list to below mediaSingle in list item', () => {
        backspaceCheck(
          doc(
            ol(
              li(p('')),
              li(
                p('nice'),
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    __key: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                p(''),
              ),
            ),

            p('{<>}after'),
          ),
          doc(
            ol(
              li(p('')),
              li(
                p('nice'),
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    __key: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                p('{<>}after'),
              ),
            ),
          ),
        );
      });

      it('selects mediaSingle in list if inside the empty paragraph after', () => {
        backspaceCheck(
          doc(
            ol(
              li(p('')),
              li(
                p('nice'),
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    __key: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                p('{<>}'),
              ),
            ),

            p('after'),
          ),
          doc(
            ol(
              li(p('')),
              li(
                p('nice'),
                '{<}',
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    __key: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                '{>}',
              ),
            ),
            p('after'),
          ),
        );
      });

      it('backspaces mediaSingle in list if selected', () => {
        backspaceCheck(
          doc(
            ol(
              li(p('')),
              li(
                p('nice{<}'),
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    __key: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                '{>}',
              ),
            ),
            p('after'),
          ),
          doc(ol(li(p('')), li(p('nice'))), p('{<>}after')),
        );
      });
    });

    describe('when hit Shift-Tab', () => {
      it('should call outdent analytics event', () => {
        const { editorView } = editor(
          doc(ol(li(p('One'), ul(li(p('Two{<>}')))))),
          trackEvent,
        );
        sendKeyToPm(editorView, 'Shift-Tab');
        expect(trackEvent).toHaveBeenCalledWith(
          'atlassian.editor.format.list.outdent.keyboard',
        );
      });
    });

    if (browser.mac) {
      describe('when on a mac', () => {
        describe('when hit Cmd-Alt-7', () => {
          it('should toggle ordered list', () => {
            const { editorView } = editor(doc(p('text{<>}')));
            sendKeyToPm(editorView, 'Cmd-Alt-7');
            expect(editorView.state.doc).toEqualDocument(
              doc(ol(li(p('text')))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.list.numbered.keyboard',
            );
          });
        });

        describe('when hit Cmd-Alt-8', () => {
          it('should toggle bullet list', () => {
            const { editorView } = editor(doc(p('text{<>}')));
            sendKeyToPm(editorView, 'Cmd-Alt-8');
            expect(editorView.state.doc).toEqualDocument(
              doc(ul(li(p('text')))),
            );
            expect(trackEvent).toHaveBeenCalledWith(
              'atlassian.editor.format.list.bullet.keyboard',
            );
          });
        });
      });
    }
  });

  describe('API', () => {
    it('should allow toggling between normal text and ordered list', () => {
      const { editorView } = editor(doc(p('t{a}ex{b}t')));

      toggleOrderedList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(ol(li(p('text')))));
      toggleOrderedList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should allow toggling between normal text and bullet list', () => {
      const { editorView } = editor(doc(p('t{<}ex{>}t')));

      toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('text')))));
      toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should allow toggling between ordered and bullet list', () => {
      const { editorView } = editor(doc(ol(li(p('t{<}ex{>}t')))));

      toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(ul(li(p('text')))));
      toggleBulletList(editorView);
      expect(editorView.state.doc).toEqualDocument(doc(p('text')));
    });

    it('should make sure that it is enabled when selecting ordered list', () => {
      const { pluginState } = editor(doc(ol(li(p('te{<>}xt')))));

      expect(pluginState).toHaveProperty('orderedListActive', true);
      expect(pluginState).toHaveProperty('orderedListDisabled', false);
      expect(pluginState).toHaveProperty('bulletListActive', false);
      expect(pluginState).toHaveProperty('bulletListDisabled', false);
    });

    it('should be disabled when selecting h1', () => {
      const { pluginState } = editor(doc(h1('te{<>}xt')));

      expect(pluginState).toHaveProperty('orderedListActive', false);
      expect(pluginState).toHaveProperty('orderedListDisabled', true);
      expect(pluginState).toHaveProperty('bulletListActive', false);
      expect(pluginState).toHaveProperty('bulletListDisabled', true);
    });

    describe('Toggling bullet list', () => {
      describe('on non list elements', () => {
        it("shouldn't affect text selection", () => {
          const { editorView } = editor(doc(p('hello{<>}')));

          toggleBulletList(editorView);
          // If the text is not selected, pressing enter will
          // create a new paragraph. If it is selected the
          // 'hello' text will be removed
          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(ul(li(p('hello')), li(p('')))),
          );
        });
      });

      describe('on a bullet list', () => {
        it('Should outdent the list to text', () => {
          const { editorView } = editor(
            doc(ul(li(p('One')), li(p('{<}Two{>}')), li(p('Three')))),
          );

          const expectedOutput = doc(p('One'), p('Two'), p('Three'));
          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });
      });
    });

    describe('untoggling a list', () => {
      it('should untoggle entire list when one element selected', () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('{<}Two')), li(p('Three{>}')), li(p('Four'))),
          ),
        );
        const expectedOutput = doc(p('One'), p('Two'), p('Three'), p('Four'));

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });
      it('should untoggle entire list when all elements selected', () => {
        const { editorView } = editor(
          doc(
            ol(li(p('{<}One')), li(p('Two')), li(p('Three')), li(p('Four{>}'))),
          ),
        );
        const expectedOutput = doc(p('One'), p('Two'), p('Three'), p('Four'));

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutput);
      });

      it('should untoggle empty paragraphs in a list', () => {
        const { editorView } = editor(
          doc(ol(li(p('{<}One')), li(p('Two')), li(p()), li(p('Three{>}')))),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('One'), p('Two'), p(), p('Three')),
        );
      });

      it('should untoggle all list items with different ancestors in selected lists', () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('{<}Two')), li(p('Three'))),
            ol(li(p('One{>}')), li(p('Two'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(p('One'), p('Two'), p('Three'), p('One'), p('Two')),
        );
      });
    });

    describe('converting a list using', () => {
      describe('Bullet to Ordered', () => {
        it('1. should convert all list elements when one element selected', () => {
          const { editorView } = editor(
            doc(ol(li(p('One')), li(p('{<}Two{>}')), li(p('Three')))),
          );

          const expectedOutput = doc(
            ul(li(p('One')), li(p('Two')), li(p('Three'))),
          );
          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('2. should convert all list elements when all elements selected', () => {
          const { editorView } = editor(
            doc(ol(li(p('{<}One')), li(p('Two')), li(p('Three{>}')))),
          );

          const expectedOutput = doc(
            ul(li(p('One')), li(p('Two')), li(p('Three'))),
          );
          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('3. should convert parent list only when selection across parent list elements', () => {
          // @see ED-5742
          // list would blow up
          const { editorView } = editor(
            doc(
              ol(
                li(p('{<}foo')),
                li(p('bar{>}'), ol(li(p('baz')), li(p('boom')))),
                li(p('whatever')),
              ),
            ),
          );

          const expectedOutput = doc(
            ul(
              li(p('foo')),
              li(p('bar'), ol(li(p('baz')), li(p('boom')))),
              li(p('whatever')),
            ),
          );

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('4. should convert child list type when parent list converted to ordered', () => {
          const { editorView } = editor(
            doc(
              ol(
                li(p('{<}One'), ol(li(p('Child element')))),
                li(p('Two')),
                li(p('Three{>}')),
              ),
            ),
          );

          const expectedOutput = doc(
            ul(
              li(p('One'), ul(li(p('Child element')))),
              li(p('Two')),
              li(p('Three')),
            ),
          );

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('5. should convert selection inside panel to list', () => {
          const { editorView } = editor(doc(panel()(p('te{<>}xt'))));
          const expectedOutput = doc(panel()(ul(li(p('text')))));

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('6. should convert selection to a list when the selection starts with a paragraph and ends inside a list', () => {
          const { editorView } = editor(
            doc(
              p('{<}One'),
              ul(li(p('Two{>}')), li(p('Three')), li(p('Four'))),
            ),
          );
          const expectedOutput = doc(
            ul(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
          );

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('7. should convert selection to a list when the selection contains a list but starts and end with paragraphs', () => {
          const { editorView } = editor(
            doc(p('{<}One'), ul(li(p('Two')), li(p('Three'))), p('Four{>}')),
          );
          const expectedOutput = doc(
            ul(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
          );

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('8. should convert selection to a list when the selection starts inside a list and ends with a paragraph', () => {
          const expectedOutput = doc(
            ul(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
          );
          const { editorView } = editor(
            doc(
              ul(li(p('One')), li(p('{<}Two')), li(p('Three'))),
              p('Four{>}'),
            ),
          );

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('9. should convert selection to a list and keep empty paragraphs', () => {
          const { editorView } = editor(
            doc(ol(li(p('{<}One')), li(p('Two')), li(p()), li(p('Three{>}')))),
          );
          const expectedOutput = doc(
            ul(li(p('One')), li(p('Two')), li(p()), li(p('Three'))),
          );

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('10. should convert selection to list when there is an empty paragraph between non empty two', () => {
          const { editorView } = editor(doc(p('{<}One'), p(), p('Three{>}')));
          const expectedOutput = doc(ul(li(p('One')), li(p()), li(p('Three'))));

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it("11. shouldn't convert child elements in subtree of sibling list items", () => {
          const { editorView } = editor(
            doc(
              ol(
                li(
                  p('first'),
                  ol(
                    li(
                      p('second'),
                      ol(
                        li(
                          p('third'),
                          ol(
                            li(
                              p('fourth'),
                              ol(li(p('fifth'), ol(li(p('sixth'))))),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                li(p('{<}2nd first{>}')),
              ),
            ),
          );
          const expectedOutput = doc(
            ul(
              li(
                p('first'),
                ol(
                  li(
                    p('second'),
                    ol(
                      li(
                        p('third'),
                        ol(
                          li(
                            p('fourth'),
                            ol(li(p('fifth'), ol(li(p('sixth'))))),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              li(p('2nd first')),
            ),
          );

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });
        it("12. shouldn't convert child elements in subtree of parent's sibling list items", () => {
          const { editorView } = editor(
            doc(
              ol(
                li(
                  p('first'),
                  ol(
                    li(
                      p('second'),
                      ol(
                        li(
                          p('third'),
                          ol(
                            li(
                              p('fourth'),
                              ol(li(p('fifth'), ol(li(p('sixth'))))),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                li(
                  p('2nd first'),
                  ol(
                    li(
                      p('{<}2nd second{>}'),
                      ol(li(p('2nd third'), ol(li(p('2nd fourth'))))),
                    ),
                  ),
                ),
              ),
            ),
          );
          const expectedOutput = doc(
            ol(
              li(
                p('first'),
                ol(
                  li(
                    p('second'),
                    ol(
                      li(
                        p('third'),
                        ol(
                          li(
                            p('fourth'),
                            ol(li(p('fifth'), ol(li(p('sixth'))))),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              li(
                p('2nd first'),
                ul(
                  li(
                    p('2nd second'),
                    ol(li(p('2nd third'), ol(li(p('2nd fourth'))))),
                  ),
                ),
              ),
            ),
          );

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it("13. shouldn't convert child elements in subtree of selection", () => {
          const { editorView } = editor(
            doc(
              ol(li(p('first'), ol(li(p('se{<}cond'), ol(li(p('th{>}ird'))))))),
            ),
          );
          const expectedOutput = doc(
            ol(li(p('first'), ul(li(p('second'), ul(li(p('third'))))))),
          );

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });
        it('14. should correctly change list type across levels', () => {
          // This test will check an issue where some text will disappear
          // in the p('second') node
          const { editorView } = editor(
            doc(
              ol(
                li(p('first'), ol(li(p('second'), ol(li(p('third')))))),
                li(
                  p('2nd first'),
                  ol(
                    li(
                      p('2nd second'),
                      ol(li(p('2nd third'), ol(li(p('{<}2nd fourth'))))),
                    ),
                  ),
                ),
                li(
                  p('3nd first'),
                  ol(li(p('3nd sec{>}ond'), ol(li(p('3rd third'))))),
                ),
              ),
            ),
          );
          const expectedOutput = doc(
            ul(
              li(p('first'), ol(li(p('second'), ol(li(p('third')))))),
              li(
                p('2nd first'),
                ol(
                  li(
                    p('2nd second'),
                    ol(li(p('2nd third'), ul(li(p('2nd fourth'))))),
                  ),
                ),
              ),
              li(
                p('3nd first'),
                ul(li(p('3nd second'), ol(li(p('3rd third'))))),
              ),
            ),
          );

          toggleBulletList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });
      });
      describe('ordered to unordered', () => {
        it('1. should convert all list elements when one element selected', () => {
          const { editorView } = editor(
            doc(ul(li(p('One')), li(p('{<}Two{>}')), li(p('Three')))),
          );

          const expectedOutput = doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
          );
          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('2. should convert all list elements when all elements selected', () => {
          const { editorView } = editor(
            doc(ul(li(p('{<}One')), li(p('Two')), li(p('Three{>}')))),
          );

          const expectedOutput = doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
          );
          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('3. should convert parent list only when selection across parent list elements', () => {
          // @see ED-5742
          // list would blow up
          const { editorView } = editor(
            doc(
              ul(
                li(p('{<}foo')),
                li(p('bar{>}'), ul(li(p('baz')), li(p('boom')))),
                li(p('whatever')),
              ),
            ),
          );

          const expectedOutput = doc(
            ol(
              li(p('foo')),
              li(p('bar'), ul(li(p('baz')), li(p('boom')))),
              li(p('whatever')),
            ),
          );

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('4. should convert child list type when parent list converted to ordered', () => {
          const { editorView } = editor(
            doc(
              ul(
                li(p('{<}One'), ul(li(p('Child element')))),
                li(p('Two')),
                li(p('Three{>}')),
              ),
            ),
          );

          const expectedOutput = doc(
            ol(
              li(p('One'), ol(li(p('Child element')))),
              li(p('Two')),
              li(p('Three')),
            ),
          );

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('5. should convert selection inside panel to list', () => {
          const { editorView } = editor(doc(panel()(p('te{<>}xt'))));
          const expectedOutput = doc(panel()(ol(li(p('text')))));

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('6. should convert selection to a list when the selection starts with a paragraph and ends inside a list', () => {
          const { editorView } = editor(
            doc(
              p('{<}One'),
              ol(li(p('Two{>}')), li(p('Three')), li(p('Four'))),
            ),
          );
          const expectedOutput = doc(
            ol(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
          );

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('7. should convert selection to a list when the selection contains a list but starts and end with paragraphs', () => {
          const { editorView } = editor(
            doc(p('{<}One'), ol(li(p('Two')), li(p('Three'))), p('Four{>}')),
          );
          const expectedOutput = doc(
            ol(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
          );

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('8. should convert selection to a list when the selection starts inside a list and ends with a paragraph', () => {
          const expectedOutput = doc(
            ol(li(p('One')), li(p('Two')), li(p('Three')), li(p('Four'))),
          );
          const { editorView } = editor(
            doc(
              ol(li(p('One')), li(p('{<}Two')), li(p('Three'))),
              p('Four{>}'),
            ),
          );

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('9. should convert selection to a list and keep empty paragraphs', () => {
          const { editorView } = editor(
            doc(ul(li(p('{<}One')), li(p('Two')), li(p()), li(p('Three{>}')))),
          );
          const expectedOutput = doc(
            ol(li(p('One')), li(p('Two')), li(p()), li(p('Three'))),
          );

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it('10. should convert selection to list when there is an empty paragraph between non empty two', () => {
          const { editorView } = editor(doc(p('{<}One'), p(), p('Three{>}')));
          const expectedOutput = doc(ol(li(p('One')), li(p()), li(p('Three'))));

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it("11. shouldn't convert child elements in subtree of sibling list items", () => {
          const { editorView } = editor(
            doc(
              ul(
                li(
                  p('first'),
                  ul(
                    li(
                      p('second'),
                      ul(
                        li(
                          p('third'),
                          ul(
                            li(
                              p('fourth'),
                              ul(li(p('fifth'), ul(li(p('sixth'))))),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                li(p('{<}2nd first{>}')),
              ),
            ),
          );
          const expectedOutput = doc(
            ol(
              li(
                p('first'),
                ul(
                  li(
                    p('second'),
                    ul(
                      li(
                        p('third'),
                        ul(
                          li(
                            p('fourth'),
                            ul(li(p('fifth'), ul(li(p('sixth'))))),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              li(p('2nd first')),
            ),
          );

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });
        it("12. shouldn't convert child elements in subtree of parent's sibling list items", () => {
          const { editorView } = editor(
            doc(
              ul(
                li(
                  p('first'),
                  ul(
                    li(
                      p('second'),
                      ul(
                        li(
                          p('third'),
                          ul(
                            li(
                              p('fourth'),
                              ul(li(p('fifth'), ul(li(p('sixth'))))),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                li(
                  p('2nd first'),
                  ul(
                    li(
                      p('{<}2nd second{>}'),
                      ul(li(p('2nd third'), ul(li(p('2nd fourth'))))),
                    ),
                  ),
                ),
              ),
            ),
          );
          const expectedOutput = doc(
            ul(
              li(
                p('first'),
                ul(
                  li(
                    p('second'),
                    ul(
                      li(
                        p('third'),
                        ul(
                          li(
                            p('fourth'),
                            ul(li(p('fifth'), ul(li(p('sixth'))))),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              li(
                p('2nd first'),
                ol(
                  li(
                    p('2nd second'),
                    ul(li(p('2nd third'), ul(li(p('2nd fourth'))))),
                  ),
                ),
              ),
            ),
          );

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });

        it("13. shouldn't convert child elements in subtree of selection", () => {
          const { editorView } = editor(
            doc(
              ul(li(p('first'), ul(li(p('se{<}cond'), ul(li(p('th{>}ird'))))))),
            ),
          );
          const expectedOutput = doc(
            ul(li(p('first'), ol(li(p('second'), ol(li(p('third'))))))),
          );

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });
        it('14. should correctly change list type across levels', () => {
          // This test will check an issue where some text will disappear
          // in the p('second') node
          const { editorView } = editor(
            doc(
              ul(
                li(p('first'), ul(li(p('second'), ul(li(p('third')))))),
                li(
                  p('2nd first'),
                  ul(
                    li(
                      p('2nd second'),
                      ul(li(p('2nd third'), ul(li(p('{<}2nd fourth'))))),
                    ),
                  ),
                ),
                li(
                  p('3nd first'),
                  ul(li(p('3nd sec{>}ond'), ul(li(p('3rd third'))))),
                ),
              ),
            ),
          );
          const expectedOutput = doc(
            ol(
              li(p('first'), ul(li(p('second'), ul(li(p('third')))))),
              li(
                p('2nd first'),
                ul(
                  li(
                    p('2nd second'),
                    ul(li(p('2nd third'), ol(li(p('2nd fourth'))))),
                  ),
                ),
              ),
              li(
                p('3nd first'),
                ol(li(p('3nd second'), ul(li(p('3rd third'))))),
              ),
            ),
          );

          toggleOrderedList(editorView);
          expect(editorView.state.doc).toEqualDocument(expectedOutput);
        });
      });
    });

    describe('joining lists', () => {
      const expectedOutputForPreviousList = doc(
        ol(
          li(p('One')),
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
        ),
        p('Six'),
      );
      const expectedOutputForNextList = doc(
        p('One'),
        ol(
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
          li(p('Six')),
        ),
      );
      const expectedOutputForPreviousAndNextList = doc(
        ol(
          li(p('One')),
          li(p('Two')),
          li(p('Three')),
          li(p('Four')),
          li(p('Five')),
          li(p('Six')),
        ),
      );

      it("should join with previous list if it's of the same type", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            p('{<}Four'),
            p('Five{>}'),
            p('Six'),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousList,
        );
      });

      it("should join with previous list if it's of the same type and selection starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three{<}'))),
            p('Four'),
            p('Five{>}'),
            p('Six'),
          ),
        ); // When selection starts on previous (empty) node

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousList,
        );
      });

      it("should not join with previous list if it's not of the same type", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            p('{<}Four'),
            p('Five{>}'),
            p('Six'),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            ul(li(p('Four')), li(p('Five'))),
            p('Six'),
          ),
        );
      });

      it("should not join with previous list if it's not of the same type and selection starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three{<}'))),
            p('Four'),
            p('Five{>}'),
            p('Six'),
          ),
        ); // When selection starts on previous (empty) node

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two')), li(p('Three'))),
            ul(li(p('Four')), li(p('Five'))),
            p('Six'),
          ),
        );
      });

      it("should join with next list if it's of the same type", () => {
        const { editorView } = editor(
          doc(
            p('One'),
            p('{<}Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutputForNextList);
      });

      it("should join with next list if it's of the same type and selection starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            p('One{<}'),
            p('Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(expectedOutputForNextList);
      });

      it("should not join with next list if it isn't of the same type", () => {
        const { editorView } = editor(
          doc(
            p('One'),
            p('{<}Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('One'),
            ul(li(p('Two')), li(p('Three'))),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );
      });

      it("should not join with next list if it isn't of the same type and selection starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            p('One{<}'),
            p('Two'),
            p('Three{>}'),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('One'),
            ul(li(p('Two')), li(p('Three'))),
            ol(li(p('Four')), li(p('Five')), li(p('Six'))),
          ),
        );
      });

      it("should join with previous and next list if they're of the same type", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two'))),
            p('{<}Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousAndNextList,
        );
      });

      it("should join with previous and next list if they're of the same type and selection starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two{<}'))),
            p('Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        toggleOrderedList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          expectedOutputForPreviousAndNextList,
        );
      });

      it("should not join with previous and next list if they're not of the same type", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two'))),
            p('{<}Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two'))),
            ul(li(p('Three')), li(p('Four'))),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );
      });

      it("should not join with previous and next list if they're not of the same type and selectoin starts at the end of previous line", () => {
        const { editorView } = editor(
          doc(
            ol(li(p('One')), li(p('Two{<}'))),
            p('Three'),
            p('Four{>}'),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );

        toggleBulletList(editorView);
        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('One')), li(p('Two'))),
            ul(li(p('Three')), li(p('Four'))),
            ol(li(p('Five')), li(p('Six'))),
          ),
        );
      });
    });

    describe('Nested Lists', () => {
      describe('When gap cursor is inside listItem before codeBlock', () => {
        it('should increase the depth of list item when Tab key press', () => {
          const { editorView } = editor(
            doc(ol(li(p('text')), li(code_block()('{<>}text')), li(p('text')))),
          );
          // enable gap cursor
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(editorView.state.selection instanceof GapCursorSelection).toBe(
            true,
          );
          expect(editorView.state.selection.$from.depth).toEqual(2);

          sendKeyToPm(editorView, 'Tab');

          expect(editorView.state.selection.$from.depth).toEqual(4);
        });

        it('should decrease the depth of list item when Shift-Tab key press', () => {
          const { editorView } = editor(
            doc(
              ol(
                li(p('text'), ol(li(code_block()('{<>}text')))),
                li(p('text')),
              ),
            ),
          );
          // enable gap cursor
          sendKeyToPm(editorView, 'ArrowLeft');
          expect(editorView.state.selection instanceof GapCursorSelection).toBe(
            true,
          );
          expect(editorView.state.selection.$from.depth).toEqual(4);

          sendKeyToPm(editorView, 'Shift-Tab');

          expect(editorView.state.selection.$from.depth).toEqual(2);
        });
      });

      it('should increase the depth of list item when Tab key press', () => {
        const { editorView } = editor(
          doc(ol(li(p('text')), li(p('te{<>}xt')), li(p('text')))),
        );
        expect(editorView.state.selection.$from.depth).toEqual(3);

        sendKeyToPm(editorView, 'Tab');

        expect(editorView.state.selection.$from.depth).toEqual(5);
      });

      it('should nest the list item when Tab key press', () => {
        const { editorView } = editor(
          doc(ol(li(p('text')), li(p('te{<>}xt')), li(p('text')))),
        );

        sendKeyToPm(editorView, 'Tab');

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text'), ol(li(p('te{<>}xt')))), li(p('text')))),
        );
      });

      it('should decrease the depth of list item when Shift-Tab key press', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('te{<>}xt')))), li(p('text')))),
        );
        expect(editorView.state.selection.$from.depth).toEqual(5);

        sendKeyToPm(editorView, 'Shift-Tab');

        expect(editorView.state.selection.$from.depth).toEqual(3);
      });

      it('should lift the list item when Shift-Tab key press', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('te{<>}xt')))), li(p('text')))),
        );

        sendKeyToPm(editorView, 'Shift-Tab');

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text')), li(p('te{<>}xt')), li(p('text')))),
        );
      });

      it('should lift nested and same level list items correctly', () => {
        const { editorView } = editor(
          doc(
            ol(li(p('some{<>}text'), ol(li(p('B')))), li(p('C'))),

            p('after'),
          ),
        );

        sendKeyToPm(editorView, 'Shift-Tab');

        expect(editorView.state.doc).toEqualDocument(
          doc(
            p('some{<>}text'),
            ol(li(p('B')), li(p('C'))),

            p('after'),
          ),
        );
      });

      it('should lift the list item when Enter key press is done on empty list-item', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('{<>}')))), li(p('text')))),
        );

        sendKeyToPm(editorView, 'Enter');

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text')), li(p('{<>}')), li(p('text')))),
        );
      });
    });

    describe('Enter key-press', () => {
      describe('when Enter key is pressed on empty nested list item', () => {
        it('should create new list item in parent list', () => {
          const { editorView } = editor(
            doc(ol(li(p('text'), ol(li(p('{<>}')))), li(p('text')))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(ol(li(p('text')), li(p('{<>}')), li(p('text')))),
          );
        });
      });

      describe('when Enter key is pressed on non-empty nested list item', () => {
        it('should created new nested list item', () => {
          const { editorView } = editor(
            doc(ol(li(p('text'), ol(li(p('test{<>}')))), li(p('text')))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(
              ol(
                li(p('text'), ol(li(p('test')), li(p('{<>}')))),
                li(p('text')),
              ),
            ),
          );
        });
      });

      describe('when Enter key is pressed on non-empty top level list item', () => {
        it('should created new list item at top level', () => {
          const { editorView } = editor(
            doc(ol(li(p('text')), li(p('test{<>}')), li(p('text')))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(ol(li(p('text')), li(p('test')), li(p('{<>}')), li(p('text')))),
          );
        });
      });

      describe('when Enter key is pressed on non-empty top level list item inside panel', () => {
        it('should created new list item at top level', () => {
          const { editorView } = editor(
            doc(panel()(ol(li(p('text')), li(p('test{<>}')), li(p('text'))))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(
              panel()(
                ol(li(p('text')), li(p('test')), li(p('{<>}')), li(p('text'))),
              ),
            ),
          );
        });
      });

      describe('when Enter key is pressed on empty top level list item', () => {
        it('should create new paragraph outside the list', () => {
          const { editorView } = editor(
            doc(ol(li(p('text')), li(p('{<>}')), li(p('text')))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(ol(li(p('text'))), p('{<>}'), ol(li(p('text')))),
          );
        });
      });

      describe('when Enter key is pressed on empty top level list item inside panel', () => {
        it('should create new paragraph outside the list', () => {
          const { editorView } = editor(
            doc(panel()(ol(li(p('text')), li(p('{<>}')), li(p('text'))))),
          );

          sendKeyToPm(editorView, 'Enter');

          expect(editorView.state.doc).toEqualDocument(
            doc(panel()(ol(li(p('text'))), p('{<>}'), ol(li(p('text'))))),
          );
        });
      });
    });

    describe('Toggle - nested list scenarios - to lift items out of list', () => {
      it('should be possible to toggle a simple nested list', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('text{<>}')))), li(p('text')))),
        );

        toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text'))), p('text{<>}'), ol(li(p('text')))),
        );
      });

      it('should be possible to toggle an empty nested list item', () => {
        const { editorView } = editor(
          doc(ol(li(p('text'), ol(li(p('{<>}')))), li(p('text')))),
        );

        toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(ol(li(p('text'))), p('{<>}'), ol(li(p('text')))),
        );
      });

      it('should be possible to toggle a selection across different depths in the list', () => {
        const { editorView } = editor(
          doc(ol(li(p('te{<}xt'), ol(li(p('tex{>}t')))), li(p('text')))),
        );

        toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('te{<}xt'), p('tex{>}t'), ol(li(p('text')))),
        );
      });

      it('should be possible to toggle a selection across lists with different parent lists', () => {
        const { editorView } = editor(
          doc(
            ol(li(p('te{<}xt'), ol(li(p('text'))))),
            ol(li(p('te{>}xt'), ol(li(p('text'))))),
          ),
        );

        toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(p('te{<}xt'), p('text'), p('te{>}xt'), p('text')),
        );
      });

      it('should be create a new list for children of lifted list item', () => {
        const { editorView } = editor(
          doc(
            ol(
              li(p('text'), ol(li(p('te{<>}xt'), ol(li(p('text')))))),
              li(p('text')),
            ),
          ),
        );

        toggleOrderedList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(li(p('text'))),
            p('te{<>}xt'),
            ol(li(p('text')), li(p('text'))),
          ),
        );
      });

      it("shouldn't change type of parent list when child list type changed", () => {
        const { editorView } = editor(
          doc(
            ol(
              li(p('text'), ol(li(p('text'), ol(li(p('te{<>}xt')))))),
              li(p('text')),
            ),
          ),
        );

        toggleBulletList(editorView);

        expect(editorView.state.doc).toEqualDocument(
          doc(
            ol(
              li(p('text'), ol(li(p('text'), ul(li(p('te{<>}xt')))))),
              li(p('text')),
            ),
          ),
        );
      });
    });

    describe('when adding media inside list', () => {
      it('should add media as media single', () => {
        const { editorView } = editor(
          doc(ul(li(p('Three')), li(p('Four{<>}')))),
        );

        insertMediaAsMediaSingle(
          editorView,
          media({
            id: temporaryFileId,
            __key: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
            __fileMimeType: 'image/png',
          })()(editorView.state.schema),
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(
            ul(
              li(p('Three')),
              li(
                p('Four'),
                mediaSingle({ layout: 'center' })(
                  media({
                    id: temporaryFileId,
                    __key: temporaryFileId,
                    type: 'file',
                    collection: testCollectionName,
                    __fileMimeType: 'image/png',
                  })(),
                ),
                p(),
              ),
            ),
          ),
        );
        editorView.destroy();
      });

      it('should not add non images inside lists', () => {
        const { editorView } = editor(
          doc(ul(li(p('Three')), li(p('Four{<>}')))),
        );

        insertMediaAsMediaSingle(
          editorView,
          media({
            id: temporaryFileId,
            __key: temporaryFileId,
            type: 'file',
            collection: testCollectionName,
            __fileMimeType: 'pdf',
          })()(editorView.state.schema),
        );

        expect(editorView.state.doc).toEqualDocument(
          doc(ul(li(p('Three')), li(p('Four{<>}')))),
        );
      });
    });
  });
});
