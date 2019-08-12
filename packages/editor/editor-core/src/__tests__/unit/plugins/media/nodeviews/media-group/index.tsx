import * as React from 'react';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import {
  mediaGroup,
  media,
  fakeMediaProvider,
  randomId,
} from '@atlaskit/editor-test-helpers';
import { nextTick } from '@atlaskit/media-test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
  MediaProvider,
} from '../../../../../../plugins/media/pm-plugins/main';
import MediaGroup from '../../../../../../plugins/media/nodeviews/mediaGroup';

import { EditorAppearance } from '../../../../../../types';

// NOTE: for the purposes of this test we are mocking MediaNodeUpdater using __mocks__ version
jest.mock('../../../../../../plugins/media/nodeviews/mediaNodeUpdater');
import { MediaNodeUpdater } from '../../../../../../plugins/media/nodeviews/mediaNodeUpdater';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  fakeMediaProvider({
    collectionName: testCollectionName,
  });

describe('nodeviews/mediaGroup', () => {
  let pluginState: MediaPluginState;
  let mediaProvider: Promise<MediaProvider>;
  let contextIdentifierProvider: Promise<ContextIdentifierProvider>;
  const mediaNode = media({
    id: 'foo',
    type: 'file',
    collection: 'collection',
  })();
  const view = {} as EditorView;
  beforeEach(() => {
    mediaProvider = getFreshMediaProvider();
    contextIdentifierProvider = Promise.resolve({
      containerId: '',
      objectId: '',
    });
    pluginState = {} as MediaPluginState;
    pluginState.getMediaOptions = () => ({} as any);
    pluginState.mediaGroupNodes = {};
    pluginState.handleMediaNodeRemoval = () => {};
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
    (MediaNodeUpdater as jest.Mock<MediaNodeUpdater>).mockReset(); // part of mocked class API, not original
  });

  it('should re-render for custom media picker with no thumb', () => {
    pluginState.getMediaOptions = () => ({ customMediaPicker: {} } as any);

    const mediaGroupNode = mediaGroup(mediaNode);
    const props = {
      view: view,
      node: mediaGroupNode(defaultSchema),
      getPos: () => 1,
      selected: null,
      editorAppearance: 'full-page' as EditorAppearance,
      mediaProvider,
      contextIdentifierProvider,
    };

    const wrapper = mount(<MediaGroup {...props} />);

    expect(wrapper.length).toEqual(1);
  });

  it('should create MediaNodeUpdators for each child node', async () => {
    pluginState.getMediaOptions = () => ({ customMediaPicker: {} } as any);

    const mediaGroupNode = mediaGroup(mediaNode);
    const props = {
      view: view,
      node: mediaGroupNode(defaultSchema),
      getPos: () => 1,
      selected: null,
      editorAppearance: 'full-page' as EditorAppearance,
      mediaProvider,
      contextIdentifierProvider,
    };

    mount(<MediaGroup {...props} />);

    await nextTick();
    await nextTick();

    // get the mocked classes stored instances
    const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;
    expect(instances).toHaveLength(1);
    expect(instances[0].copyNode).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
