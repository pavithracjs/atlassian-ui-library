import { Context, FileIdentifier } from '@atlaskit/media-core';
import { reducer } from '../../../../plugins/media-editor/plugin';
import { MediaEditorState } from '../../../../plugins/media-editor/types';

describe('media editor', () => {
  const mockContext = jest.fn<Context>(() => ({
    getImage: () => {
      return new Promise(() => {});
    },
    getImageMetadata: () => {
      return new Promise(() => {});
    },
    getImageUrl: () => {
      return new Promise(() => {});
    },
  }));

  describe('reducer', () => {
    const context = new mockContext();
    const identifier: FileIdentifier = {
      id: 'abc',
      mediaItemType: 'file',
      collectionName: 'xyz',
    };

    it('can set the context to a value', () => {
      expect(
        reducer(
          {},
          {
            type: 'setContext',
            context,
          },
        ),
      ).toEqual({ context });
    });

    it('can unset the context', () => {
      expect(
        reducer({ context }, { type: 'setContext', context: undefined }),
      ).toEqual({});
    });

    it('can open the media editor', () => {
      expect(
        reducer({ context }, { type: 'setContext', context: undefined }),
      ).toEqual({});
    });

    describe('when media editor is open', () => {
      const pluginState: MediaEditorState = {
        context,
        editor: { pos: 123, identifier },
      };

      it('closes it on close event', () => {
        expect(
          reducer(pluginState, {
            type: 'close',
          }),
        ).toEqual({ context });
      });

      it('closes it on upload event', () => {
        expect(
          reducer(pluginState, {
            type: 'upload',
            newIdentifier: {
              id: 'newid',
              mediaItemType: 'file',
              collectionName: 'newCollection',
            },
          }),
        ).toEqual({ context });
      });
    });
  });
});
