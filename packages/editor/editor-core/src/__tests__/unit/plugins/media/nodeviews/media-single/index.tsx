import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { EditorView } from 'prosemirror-view';
import {
  mediaSingle,
  media,
  randomId,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';
import { defaultSchema, MediaAttributes } from '@atlaskit/adf-schema';
import {
  stateKey as mediaStateKey,
  MediaPluginState,
  MediaState,
  MediaProvider,
} from '../../../../../../plugins/media/pm-plugins/main';
import MediaSingle, {
  ReactMediaSingleNode,
} from '../../../../../../plugins/media/nodeviews/mediaSingle';
import Media from '../../../../../../plugins/media/nodeviews/media';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EventDispatcher } from '../../../../../../event-dispatcher';
import { PortalProviderAPI } from '../../../../../../ui/PortalProvider';
import { stateKey as SelectionChangePluginKey } from '../../../../../../plugins/base/pm-plugins/react-nodeview';
import { MediaOptions } from '../../../../../../plugins/media';
import * as mediaCommands from '../../../../../../plugins/media/commands/media';

const testCollectionName = `media-plugin-mock-collection-${randomId()}`;

const getFreshMediaProvider = () =>
  storyMediaProviderFactory({
    collectionName: testCollectionName,
    includeUserAuthProvider: true,
  });

describe('nodeviews/mediaSingle', () => {
  let pluginState: MediaPluginState;
  const mediaNodeAttrs = {
    id: 'foo',
    type: 'file',
    collection: 'collection',
    width: 250,
    height: 250,
  };

  const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
  const externalMediaNode = media({
    type: 'external',
    url: 'http://image.jpg',
  })();

  const view = {
    state: {
      selection: {
        from: 0,
        to: 0,
      },
    },
  } as EditorView;
  const eventDispatcher = {} as EventDispatcher;
  const getPos = jest.fn();
  const mediaOptions: MediaOptions = {
    allowResizing: false,
  };
  const portalProviderAPI: PortalProviderAPI = {
    render(component: () => React.ReactChild | null) {
      component();
    },
    remove() {},
  } as any;
  let mediaProvider: Promise<MediaProvider>;
  let providerFactory: ProviderFactory;
  let getDimensions: any;

  beforeEach(() => {
    mediaProvider = getFreshMediaProvider();
    providerFactory = ProviderFactory.create({ mediaProvider });
    pluginState = ({
      getMediaNodeStateStatus: (id: string) => 'ready',
      getMediaNodeState: (id: string) => {
        return ({ state: 'ready' } as any) as MediaState;
      },
      mediaNodes: [],
      options: {
        ...mediaOptions,
        providerFactory: providerFactory,
      },
      handleMediaNodeMount: () => {},
      updateElement: jest.fn(),
      updateMediaNodeAttrs: jest.fn(),
    } as any) as MediaPluginState;

    getDimensions = (wrapper: ReactWrapper) => (): Promise<any> => {
      if ((wrapper.props() as any).node.firstChild.attrs.type === 'external') {
        return Promise.resolve(false);
      }
      return Promise.resolve({
        id: 'foo',
        height: 100,
        width: 100,
      });
    };

    jest.spyOn(mediaStateKey, 'getState').mockImplementation(() => pluginState);
    jest.spyOn(SelectionChangePluginKey, 'getState').mockImplementation(() => ({
      subscribe: jest.fn(),
      unsubscribe: jest.fn(),
    }));
  });

  it('sets "onExternalImageLoaded" for external images', () => {
    const mediaSingleNode = mediaSingle()(externalMediaNode);
    const wrapper = mount(
      <MediaSingle
        view={view}
        eventDispatcher={eventDispatcher}
        node={mediaSingleNode(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
        editorAppearance="full-page"
        mediaOptions={mediaOptions}
        mediaProvider={mediaProvider}
      />,
    );

    expect(wrapper.find(Media).props().onExternalImageLoaded).toBeDefined();
  });

  it('passes the editor width down as cardDimensions', () => {
    const mediaSingleNode = mediaSingle()(mediaNode);
    const wrapper = mount(
      <MediaSingle
        view={view}
        eventDispatcher={eventDispatcher}
        node={mediaSingleNode(defaultSchema)}
        lineLength={680}
        getPos={getPos}
        width={123}
        selected={() => 1}
        editorAppearance="full-page"
        mediaOptions={mediaOptions}
        mediaProvider={mediaProvider}
      />,
    );

    const { cardDimensions } = wrapper.find(Media).props();
    const imageAspectRatio = mediaNodeAttrs.height / mediaNodeAttrs.width;

    expect(cardDimensions.width).toEqual('123px');
    const cardHeight: string = cardDimensions.height as string;

    expect(Number(cardHeight.substring(0, cardHeight.length - 2))).toBeCloseTo(
      123 * imageAspectRatio,
    );
  });

  describe('re-rendering based on offsetLeft', () => {
    const node = mediaSingle()(mediaNode)(defaultSchema);

    it('does not call render if the parent has not offsetLeft changed', () => {
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        mediaOptions,
        'full-page',
      )(node, view, getPos);

      const renderMock = jest.fn();
      nodeView.render = renderMock;

      nodeView.ignoreMutation();
      expect(renderMock).not.toBeCalled();
    });

    it('re-renders if the parent offsetLeft changes', () => {
      const nodeView = ReactMediaSingleNode(
        portalProviderAPI,
        eventDispatcher,
        providerFactory,
        mediaOptions,
        'full-page',
      )(node, view, getPos);

      const renderMock = jest.fn();
      nodeView.render = renderMock;

      Object.defineProperties(nodeView.dom!, {
        offsetLeft: {
          get: () => 20,
        },
      });

      nodeView.ignoreMutation();
      expect(renderMock).toBeCalled();
    });
  });

  describe('when dimensions are missing on images', () => {
    it('asks media APIs for dimensions when not in ADF and updates it', async () => {
      const updateMediaNodeAttrsSpy = jest.spyOn(
        mediaCommands,
        'updateMediaNodeAttrs',
      );
      const mediaNodeAttrs = {
        id: 'foo',
        type: 'file',
        collection: 'collection',
      };

      const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
      const mediaSingleNodeWithoutDimensions = mediaSingle()(mediaNode);

      const wrapper = mount(
        <MediaSingle
          view={view}
          eventDispatcher={eventDispatcher}
          node={mediaSingleNodeWithoutDimensions(defaultSchema)}
          lineLength={680}
          getPos={getPos}
          width={123}
          selected={() => 1}
          editorAppearance="full-page"
          mediaOptions={mediaOptions}
          mediaProvider={mediaProvider}
        />,
      );

      (wrapper.instance() as MediaSingle).getRemoteDimensions = getDimensions(
        wrapper,
      );

      await (wrapper.instance() as MediaSingle).componentDidMount();
      expect(updateMediaNodeAttrsSpy).toHaveBeenCalledWith(
        'foo',
        {
          height: 100,
          width: 100,
        },
        true,
      );
    });

    it('does not ask media for dimensions when the image type is external', async () => {
      const updateMediaNodeAttrsSpy = jest.spyOn(
        mediaCommands,
        'updateMediaNodeAttrs',
      );
      const mediaNodeAttrs = {
        id: 'foo',
        type: 'external',
        collection: 'collection',
      };

      const mediaNode = media(mediaNodeAttrs as MediaAttributes)();
      const mediaSingleNodeWithoutDimensions = mediaSingle()(mediaNode);

      const wrapper = mount(
        <MediaSingle
          view={view}
          eventDispatcher={eventDispatcher}
          node={mediaSingleNodeWithoutDimensions(defaultSchema)}
          lineLength={680}
          getPos={getPos}
          width={123}
          selected={() => 1}
          editorAppearance="full-page"
          mediaOptions={mediaOptions}
          mediaProvider={mediaProvider}
        />,
      );

      (wrapper.instance() as MediaSingle).getRemoteDimensions = getDimensions(
        wrapper,
      );

      await (wrapper.instance() as MediaSingle).componentDidMount();
      expect(updateMediaNodeAttrsSpy).toHaveBeenCalledTimes(0);
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
});
