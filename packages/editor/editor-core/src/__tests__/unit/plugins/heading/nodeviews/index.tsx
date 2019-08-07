import { HeadingNodeView } from '../../../../../plugins/heading/nodeviews';
import { mount } from 'enzyme';
import { copyTextToClipboard } from '../../../../../plugins/heading';
import { Node as PMNode } from 'prosemirror-model';
import { ProviderFactory } from '@atlaskit/editor-common';

jest.mock('../../../../../plugins/base/pm-plugins/react-nodeview', () => ({
  stateKey: {
    getState: () => ({
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    }),
  },
}));

jest.mock('prosemirror-utils', () => ({
  findChildren: jest.fn(),
}));

jest.mock('../../../../../plugins/heading', () => ({
  copyTextToClipboard: jest.fn(),
}));

import { findChildren } from 'prosemirror-utils';
import {
  fromHTML,
  createEditorFactory,
} from '../../../../../../../editor-test-helpers';
import { createSchema } from '../../../../../../../adf-schema';
import { asMock } from '../../../../../../../../media/media-test-helpers/src';

function makeSchema() {
  return createSchema({
    nodes: ['doc', 'paragraph', 'heading', 'text'],
    marks: [],
  });
}

describe('HeadingNodeView', () => {
  const updatePos = jest.fn(() => 1);
  const dispatchAnalyticsEvent = jest.fn();
  const node: PMNode = fromHTML('<h1>Heading 1</h1>', makeSchema()).firstChild!;
  const providerFactory = new ProviderFactory();
  const createEditor = createEditorFactory();
  const editor = createEditor({
    editorProps: {},
    providerFactory,
  });
  const editorView = editor.editorView;

  const portalProviderAPI = {
    render: jest.fn(),
  } as any;

  it('Calls dispatchAnalyticsEvent with correct params', () => {
    asMock(findChildren).mockReturnValue([]);
    const headingNodeView = new HeadingNodeView(
      node,
      editorView,
      updatePos,
      portalProviderAPI,
      dispatchAnalyticsEvent,
    ).init();

    const subject = mount(headingNodeView.render({}, () => null));
    subject.props().onClick();
    expect(dispatchAnalyticsEvent).toHaveBeenCalledWith({
      action: 'clicked',
      actionSubject: 'button',
      actionSubjectId: 'headingAnchorLink',
      eventType: 'ui',
    });
    expect(copyTextToClipboard).toHaveBeenCalled();
    subject.unmount();
  });

  it('creates correct heading id', () => {
    const node2 = { ...node };
    const node3 = { ...node };
    asMock(findChildren).mockReturnValue([
      { node: node3 },
      { node: node2 },
      { node: node },
    ]);

    const headingNodeView = new HeadingNodeView(
      node,
      editorView,
      updatePos,
      portalProviderAPI,
      dispatchAnalyticsEvent,
    ).init();
    expect(headingNodeView.currentHeadingId()).toEqual('Heading-1.2');
  });
});
