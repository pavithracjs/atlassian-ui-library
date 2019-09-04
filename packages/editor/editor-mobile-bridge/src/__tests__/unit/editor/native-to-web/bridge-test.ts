const mockCalls = [] as string[];

const mockEditorCore = {
  ...jest.genMockFromModule('@atlaskit/editor-core'),
  indentList: jest.fn(() => () => {}),
  outdentList: jest.fn(() => () => {}),
  toggleOrderedList: jest.fn(() => () => {}),
  toggleBulletList: jest.fn(() => () => {}),
  insertLink: jest.fn(() => () => {}),
  isTextAtPos: jest.fn(pos => () => [2, 6].indexOf(pos) !== -1),
  isLinkAtPos: jest.fn(pos => () => pos === 6),
  setLinkHref: jest.fn(() => () => mockCalls.push('setLinkHref')),
  setLinkText: jest.fn(() => () => mockCalls.push('setLinkText')),
  clearEditorContent: jest.fn(() => {}),
};

jest.mock('../../../../version.json', () => ({
  name: '@atlaskit/editor-mobile-bridge',
  version: '1.2.3.4',
}));

jest.mock('@atlaskit/editor-core', () => mockEditorCore);

import {
  indentList,
  outdentList,
  toggleOrderedList,
  toggleBulletList,
  insertLink,
  isTextAtPos,
  isLinkAtPos,
  setLinkHref,
  setLinkText,
  clearEditorContent,
} from '@atlaskit/editor-core';

import WebBridgeImpl from '../../../../editor/native-to-web';

describe('general', () => {
  const bridge: any = new WebBridgeImpl();

  it('should return valid bridge version', () => {
    expect(bridge.currentVersion()).toEqual('1.2.3.4');
  });
});

describe('lists should work', () => {
  const bridge: any = new WebBridgeImpl();

  beforeEach(() => {
    mockCalls.length = 0;
    bridge.editorView = {};
    bridge.listBridgeState = {};
  });

  afterEach(() => {
    bridge.editorView = undefined;
    bridge.listBridgeState = undefined;

    ((indentList as unknown) as jest.Mock<{}>).mockClear();
    ((outdentList as unknown) as jest.Mock<{}>).mockClear();
    ((toggleOrderedList as unknown) as jest.Mock<{}>).mockClear();
    ((toggleBulletList as unknown) as jest.Mock<{}>).mockClear();
  });

  it('should call ordered list toggle', () => {
    bridge.onOrderedListSelected();
    expect(toggleOrderedList).toBeCalled();
  });

  it('should not call ordered list if view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onOrderedListSelected();
    expect(toggleOrderedList).not.toBeCalled();
  });

  it('should not call ordered list if state is undefined', () => {
    bridge.listBridgeState = undefined;
    bridge.onOrderedListSelected();
    expect(toggleOrderedList).not.toBeCalled();
  });

  it('should call bullet list toggle', () => {
    bridge.onBulletListSelected();
    expect(toggleBulletList).toBeCalled();
  });

  it('should not call bullet list if view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onBulletListSelected();
    expect(toggleBulletList).not.toBeCalled();
  });

  it('should not call bullet list if state is undefined', () => {
    bridge.listBridgeState = undefined;
    bridge.onBulletListSelected();
    expect(toggleBulletList).not.toBeCalled();
  });

  it('should call indent list', () => {
    bridge.onIndentList();
    expect(indentList).toBeCalled();
  });

  it('should not call indent list if view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onIndentList();
    expect(indentList).not.toBeCalled();
  });

  it('should not call indent list if state is undefined', () => {
    bridge.listBridgeState = undefined;
    bridge.onIndentList();
    expect(indentList).not.toBeCalled();
  });

  it('should call outdent list', () => {
    bridge.onOutdentList();
    expect(outdentList).toBeCalled();
  });

  it('should not call outdent list if view is undefined', () => {
    bridge.editorView = undefined;
    bridge.onOutdentList();
    expect(outdentList).not.toBeCalled();
  });

  it('should not call outdent list if state is undefined', () => {
    bridge.listBridgeState = undefined;
    bridge.onOutdentList();
    expect(outdentList).not.toBeCalled();
  });
});

describe('links should work', () => {
  const bridge: any = new WebBridgeImpl();

  beforeEach(() => {
    mockCalls.length = 0;
    bridge.editorView = {};
  });

  afterEach(() => {
    bridge.editorView = undefined;

    ((insertLink as unknown) as jest.Mock<{}>).mockClear();
    ((isTextAtPos as unknown) as jest.Mock<{}>).mockClear();
    ((isLinkAtPos as unknown) as jest.Mock<{}>).mockClear();
    ((setLinkHref as unknown) as jest.Mock<{}>).mockClear();
    ((setLinkText as unknown) as jest.Mock<{}>).mockClear();
  });

  it('should call insertLink when not on text node', () => {
    bridge.editorView = {
      state: {
        selection: {
          from: 1, // mock won't resolve pos as text node
          to: 3,
        },
      },
    };

    bridge.onLinkUpdate('text', 'url');

    expect(isTextAtPos).toHaveBeenCalledWith(1);
    expect(insertLink).toHaveBeenCalledWith(1, 3, 'url', 'text');
  });

  it('should call setLinkHref then setLinkText when on text node', () => {
    bridge.editorView = {
      state: {
        selection: {
          from: 2, // mock will resolve pos as text node
        },
      },
    };

    bridge.onLinkUpdate('text', 'url');

    expect(isTextAtPos).toHaveBeenCalledWith(2);
    expect(isLinkAtPos).toHaveBeenCalledWith(2);
    expect(setLinkHref).toHaveBeenCalledWith('url', 2, undefined);
    expect(setLinkText).toHaveBeenCalledWith('text', 2, undefined);
    expect(mockCalls).toEqual(
      expect.arrayContaining(['setLinkHref', 'setLinkText']),
    );
  });

  it('should call setLinkHref then setLinkText when on selected text node', () => {
    bridge.editorView = {
      state: {
        selection: {
          from: 2, // mock will resolve pos as text node
          to: 4,
        },
      },
    };

    bridge.onLinkUpdate('text', 'url');

    expect(isTextAtPos).toHaveBeenCalledWith(2);
    expect(isLinkAtPos).toHaveBeenCalledWith(2);
    expect(setLinkHref).toHaveBeenCalledWith('url', 2, 4);
    expect(setLinkText).toHaveBeenCalledWith('text', 2, 4);
    expect(mockCalls).toEqual(
      expect.arrayContaining(['setLinkHref', 'setLinkText']),
    );
  });

  it('should call setLinkHref then setLinkText when providing url only', () => {
    bridge.editorView = {
      state: {
        selection: {
          from: 2, // mock will resolve pos as text node
        },
      },
    };

    bridge.onLinkUpdate('', 'url');

    expect(isTextAtPos).toHaveBeenCalledWith(2);
    expect(isLinkAtPos).toHaveBeenCalledWith(2);
    expect(setLinkHref).toHaveBeenCalledWith('url', 2, undefined);
    expect(setLinkText).toHaveBeenCalledWith('', 2, undefined);
    expect(mockCalls).toEqual(
      expect.arrayContaining(['setLinkHref', 'setLinkText']),
    );
  });

  it('should call setLinkHref then setLinkText when providing url only + selection', () => {
    bridge.editorView = {
      state: {
        selection: {
          from: 2, // mock will resolve pos as text node
          to: 4,
        },
      },
    };

    bridge.onLinkUpdate('', 'url');

    expect(isTextAtPos).toHaveBeenCalledWith(2);
    expect(isLinkAtPos).toHaveBeenCalledWith(2);
    expect(setLinkHref).toHaveBeenCalledWith('url', 2, 4);
    expect(setLinkText).toHaveBeenCalledWith('', 2, 4);
    expect(mockCalls).toEqual(
      expect.arrayContaining(['setLinkHref', 'setLinkText']),
    );
  });

  it('should call setLinkHref then setLinkText using full link when on a link', () => {
    bridge.editorView = {
      state: {
        doc: {
          resolve: jest.fn(() => ({ textOffset: 1 })),
        },
        selection: {
          from: 6, // mock will resolve pos as link
        },
      },
    };

    bridge.onLinkUpdate('link', 'href');

    expect(isTextAtPos).toHaveBeenCalledWith(6);
    expect(isLinkAtPos).toHaveBeenCalledWith(6);
    expect(bridge.editorView.state.doc.resolve).toHaveBeenCalledWith(6);
    expect(setLinkHref).toHaveBeenCalledWith('href', 5, undefined);
    expect(setLinkText).toHaveBeenCalledWith('link', 5, undefined);
    expect(mockCalls).toEqual(
      expect.arrayContaining(['setLinkHref', 'setLinkText']),
    );
  });

  it('should call setLinkText then setLinkHref when providing no url', () => {
    bridge.editorView = {
      state: {
        selection: {
          from: 2, // mock will resolve pos as text node
        },
      },
    };

    bridge.onLinkUpdate('text', '');

    expect(isTextAtPos).toHaveBeenCalledWith(2);
    expect(isLinkAtPos).toHaveBeenCalledWith(2);
    expect(setLinkHref).toHaveBeenCalledWith('', 2, undefined);
    expect(setLinkText).toHaveBeenCalledWith('text', 2, undefined);
    expect(mockCalls).toEqual(
      expect.arrayContaining(['setLinkText', 'setLinkHref']),
    );
  });

  it('should call setLinkText then setLinkHref when providing no url + selection', () => {
    bridge.editorView = {
      state: {
        selection: {
          from: 2, // mock will resolve pos as text node
          to: 4,
        },
      },
    };

    bridge.onLinkUpdate('text', '');

    expect(isTextAtPos).toHaveBeenCalledWith(2);
    expect(isLinkAtPos).toHaveBeenCalledWith(2);
    expect(setLinkHref).toHaveBeenCalledWith('', 2, 4);
    expect(setLinkText).toHaveBeenCalledWith('text', 2, 4);
    expect(mockCalls).toEqual(
      expect.arrayContaining(['setLinkText', 'setLinkHref']),
    );
  });
});

describe('content should work', () => {
  const bridge: any = new WebBridgeImpl();

  beforeEach(() => {
    mockCalls.length = 0;
    bridge.editorView = {};
  });

  afterEach(() => {
    bridge.editorView = undefined;

    ((clearEditorContent as unknown) as jest.Mock<{}>).mockClear();
  });

  it('should clear content', () => {
    bridge.clearContent();
    expect(clearEditorContent).toHaveBeenCalled();
  });
});
