import {
  createEditorFactory,
  doc,
  panel,
  layoutSection,
  layoutColumn,
  p,
} from '@atlaskit/editor-test-helpers';
import {
  hoverDecoration,
  decorationStateKey,
  DecorationState,
} from '../../../../plugins/base/pm-plugins/decoration';
import { deleteActiveLayoutNode } from '../../../../plugins/layout/actions';

describe('decoration', () => {
  const createEditor = createEditorFactory();

  const editor = (doc: any) => {
    return createEditor({
      doc,
      editorProps: {
        allowPanel: true,
        allowLayouts: true,
      },
    });
  };

  it('adds a decoration', () => {
    const { editorView } = editor(doc(panel()(p('he{<>}llo'))));
    const { dispatch } = editorView;

    hoverDecoration(editorView.state.schema.nodes.panel, true)(
      editorView.state,
      dispatch,
    );
    const pluginState: DecorationState = decorationStateKey.getState(
      editorView.state,
    );

    expect(pluginState.decoration).toBeDefined();
    expect(pluginState.decoration!.from).toBe(0);
  });

  it('removes decoration when node is deleted from document', () => {
    const { editorView } = editor(
      doc(
        panel()(p('hello')),
        layoutSection(
          layoutColumn({ width: 50 })(p('{<>}')),
          layoutColumn({ width: 50 })(p('')),
        ),
      ),
    );

    const {
      dispatch,
      state: {
        schema: { nodes },
      },
    } = editorView;

    hoverDecoration(nodes.layoutSection, true)(editorView.state, dispatch);
    deleteActiveLayoutNode(editorView.state, dispatch);

    const pluginState = decorationStateKey.getState(editorView.state);
    expect(pluginState.decoration).toBeUndefined();
  });
});
