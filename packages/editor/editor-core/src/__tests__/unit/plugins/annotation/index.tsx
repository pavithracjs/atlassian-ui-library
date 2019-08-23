import * as React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common';
import { mount } from 'enzyme';
import {
  createEditorFactory,
  doc,
  p,
  annotation,
} from '@atlaskit/editor-test-helpers';
import { removeInlineCommentNearSelection } from '../../../../plugins/annotation/commands';
import annotationPlugin, {
  AnnotationComponentProps,
} from '../../../../plugins/annotation';
import { EventDispatcher } from '../../../../event-dispatcher';

describe('annotation', () => {
  const createEditor = createEditorFactory();
  const eventDispatcher = new EventDispatcher();
  const providerFactory = new ProviderFactory();
  const mockComponent = () => {
    return null;
  };

  const editor = (
    doc: any,
    annotationComponent?: React.ComponentType<AnnotationComponentProps>,
  ) =>
    createEditor({
      doc,
      editorProps: {
        annotationProvider: {
          component: annotationComponent,
        },
      },
    });

  describe('removeInlineCommentAtCurrentPos', () => {
    it('removes the annotation matching the id', () => {
      const { editorView } = editor(
        doc(
          p(
            'hello ',
            annotation({
              annotationType: 'inlineComment',
              id: '123',
            })('anno{<>}tated'),
          ),
        ),
      );

      const { dispatch, state } = editorView;
      removeInlineCommentNearSelection('123')(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(doc(p('hello annotated')));
    });

    it('leaves other annotations alone', () => {
      const { editorView } = editor(
        doc(
          p(
            'hello ',
            annotation({
              annotationType: 'inlineComment',
              id: '123',
            })(
              annotation({ annotationType: 'inlineComment', id: 'nested' })(
                'dou{<>}ble',
              ),
              'single',
            ),
            'world',
          ),
        ),
      );

      const { dispatch, state } = editorView;
      removeInlineCommentNearSelection('123')(state, dispatch);

      expect(editorView.state.doc).toEqualDocument(
        doc(
          p(
            'hello ',
            annotation({
              annotationType: 'inlineComment',
              id: 'nested',
            })('double'),
            'singleworld',
          ),
        ),
      );
    });
  });

  describe('component', () => {
    it('passes the visible annotations to the component', () => {
      const { editorView } = editor(
        doc(
          p(
            'hello ',
            annotation({
              annotationType: 'inlineComment',
              id: '123',
            })(
              annotation({ annotationType: 'inlineComment', id: 'nested' })(
                'dou{<>}ble',
              ),
              'single',
            ),
            'world',
          ),
        ),
        mockComponent,
      );

      const cc = mount(
        annotationPlugin({ component: mockComponent }).contentComponent!({
          editorView,
          editorActions: null as any,
          eventDispatcher,
          providerFactory,
          appearance: 'full-page',
          disabled: false,
          containerElement: undefined,
        })!,
      );

      expect(cc.find(mockComponent).prop('annotations')).toEqual([
        { type: 'inlineComment', id: 'nested' },
        { type: 'inlineComment', id: '123' },
      ]);

      cc.unmount();
    });

    it('passes the annotations in nesting order', () => {
      const { editorView } = editor(
        doc(
          p(
            'hello ',
            annotation({
              annotationType: 'inlineComment',
              id: 'second',
            })(
              annotation({ annotationType: 'inlineComment', id: 'first' })(
                'dou{<>}ble',
              ),
            ),

            annotation({ annotationType: 'inlineComment', id: 'first' })(
              'single',
            ),

            'world',
          ),
        ),
        mockComponent,
      );

      // ensure nested annotation has [first, second] mark ids
      const innerNode = editorView.state.doc.nodeAt(
        editorView.state.selection.$from.pos,
      )!;

      expect(innerNode.marks[0].attrs.id).toEqual('first');
      expect(innerNode.marks[1].attrs.id).toEqual('second');

      const cc = mount(
        annotationPlugin({ component: mockComponent }).contentComponent!({
          editorView,
          editorActions: null as any,
          eventDispatcher,
          providerFactory,
          appearance: 'full-page',
          disabled: false,
          containerElement: undefined,
        })!,
      );

      // since outer text also has 'first' mark id, we expect 'second' to appear first
      expect(cc.find(mockComponent).prop('annotations')).toEqual([
        { type: 'inlineComment', id: 'second' },
        { type: 'inlineComment', id: 'first' },
      ]);

      cc.unmount();
    });
  });
});
