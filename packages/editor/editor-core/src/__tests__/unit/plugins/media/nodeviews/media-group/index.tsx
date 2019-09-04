// NOTE: for the purposes of this test we are mocking MediaNodeUpdater using __mocks__ version
jest.mock('../../../../../../plugins/media/nodeviews/mediaNodeUpdater');

import * as React from 'react';
import { mount } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import {
  mediaGroup,
  media,
  fakeMediaProvider,
} from '@atlaskit/editor-test-helpers';
import { nextTick } from '@atlaskit/media-test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
  MediaProvider,
} from '../../../../../../plugins/media/pm-plugins/main';
import MediaGroup from '../../../../../../plugins/media/nodeviews/mediaGroup';
import { EditorAppearance } from '../../../../../../types';
import { MediaNodeUpdater } from '../../../../../../plugins/media/nodeviews/mediaNodeUpdater';
const MockMediaNodeUpdater = MediaNodeUpdater as jest.Mock<MediaNodeUpdater>;

describe('nodeviews/mediaGroup', () => {
  let pluginState: MediaPluginState;
  let mediaProvider: Promise<MediaProvider>;

  const mediaNode = media({
    id: 'foo',
    type: 'file',
    collection: 'collection',
  })();

  const externalMediaNode = media({
    type: 'external',
    url: 'some-url',
  })();

  const view = {} as EditorView;

  beforeEach(() => {
    mediaProvider = fakeMediaProvider();
    pluginState = {} as MediaPluginState;
    pluginState.getMediaOptions = () => ({} as any);
    pluginState.mediaGroupNodes = {};
    pluginState.handleMediaNodeRemoval = () => {};
    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
    MockMediaNodeUpdater.mockReset(); // part of mocked class API, not original
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
    };

    const wrapper = mount(<MediaGroup {...props} />);

    expect(wrapper.length).toEqual(1);
  });

  describe('MediaNodeUpdater', () => {
    const instances: MediaNodeUpdater[] = (MediaNodeUpdater as any).instances;

    const setup = async (node: any) => {
      pluginState.getMediaOptions = () => ({ customMediaPicker: {} } as any);

      const mediaGroupNode = mediaGroup(node);
      const props = {
        view: view,
        node: mediaGroupNode(defaultSchema),
        getPos: () => 1,
        selected: null,
        editorAppearance: 'full-page' as EditorAppearance,
        mediaProvider,
      };

      const wrapper = mount(<MediaGroup {...props} />);

      await nextTick();
      await nextTick();

      return {
        wrapper,
      };
    };

    it('should create a MediaNodeUpdater for each child node', async () => {
      await setup(mediaNode);

      expect(instances).toHaveLength(1);
      expect(instances[0].copyNode).toHaveBeenCalled();
    });

    it('should not create a MediaNodeUpdater when node is external', async () => {
      await setup(externalMediaNode);

      expect(instances).toHaveLength(0);
    });

    it('should call MediaNodeUpdater.updateContextId when node contextId is not found', async () => {
      (MediaNodeUpdater as any).setMock(
        'getCurrentContextId',
        jest.fn().mockReturnValue(undefined),
      );
      await setup(mediaNode);

      expect(instances[0].updateContextId).toHaveBeenCalled();
    });

    it('should only call MediaNodeUpdater.copyNode when node from different collection', async () => {
      (MediaNodeUpdater as any).setMock(
        'isNodeFromDifferentCollection',
        jest.fn().mockResolvedValue(false),
      );
      await setup(mediaNode);

      expect(instances).toHaveLength(1);
      expect(instances[0].copyNode).not.toHaveBeenCalled();
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
