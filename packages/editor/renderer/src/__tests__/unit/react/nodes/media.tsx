import * as React from 'react';
import { mount } from 'enzyme';
import { MediaType } from '@atlaskit/adf-schema';
import { Card, CardEvent } from '@atlaskit/media-card';
import { MediaCard, MediaCardInternal } from '../../../../ui/MediaCard';
import Media from '../../../../react/nodes/media';
import {
  FileIdentifier,
  ExternalImageIdentifier,
  ContextFactory,
} from '@atlaskit/media-core';

describe('Media', () => {
  const mediaNode = {
    type: 'media',
    attrs: {
      type: 'file',
      id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
      collection: 'MediaServicesSample',
    },
  };

  it('should render a media component with the proper props', async () => {
    const mediaComponent = mount(
      <Media
        type={mediaNode.attrs.type as MediaType}
        id={mediaNode.attrs.id}
        collection={mediaNode.attrs.collection}
      />,
    );

    expect(mediaComponent.find(MediaCard).length).toEqual(1);
    mediaComponent.unmount();
  });

  it('should render a media component with external image', async () => {
    const mediaComponent = mount(
      <Media type="external" url="http://image.jpg" />,
    );

    expect(mediaComponent.find(MediaCard).length).toEqual(1);
    mediaComponent.unmount();
  });

  describe('<MediaCard />', () => {
    it('should pass shouldOpenMediaViewer=true if there is no onClick callback', () => {
      const cardWithOnClick = mount(
        <MediaCard
          type="file"
          id="1"
          eventHandlers={{ media: { onClick: jest.fn() } }}
        />,
      );
      const cardWithoutOnClick = mount(<MediaCard type="file" id="1" />);

      // force media context to be resolved
      cardWithOnClick.find(MediaCardInternal).setState({ context: {} });
      cardWithoutOnClick.find(MediaCardInternal).setState({ context: {} });

      expect(
        cardWithOnClick.find(Card).prop('shouldOpenMediaViewer'),
      ).toBeFalsy();
      expect(
        cardWithoutOnClick.find(Card).prop('shouldOpenMediaViewer'),
      ).toBeTruthy();
    });

    it('should call passed onClick', () => {
      const onClick = jest.fn();
      const cardWithOnClick = mount(
        <MediaCard type="file" id="1" eventHandlers={{ media: { onClick } }} />,
      );

      // force media context to be resolved
      cardWithOnClick.find(MediaCardInternal).setState({ context: {} });
      const cardComponent = cardWithOnClick.find(Card);
      const event: CardEvent = {
        event: {} as any,
        mediaItemDetails: {
          id: 'some-id',
          mediaType: 'image',
        },
      };
      cardComponent.props().onClick!(event);
      expect(onClick).toHaveBeenCalledWith(event, undefined);
    });

    it('should not call passed onClick when inline video is enabled and its a video file', () => {
      const onClick = jest.fn();
      const cardWithOnClick = mount(
        <MediaCard type="file" id="1" eventHandlers={{ media: { onClick } }} />,
      );

      // force media context to be resolved
      cardWithOnClick.find(MediaCardInternal).setState({ context: {} });
      const cardComponent = cardWithOnClick.find(Card);
      const event: CardEvent = {
        event: {} as any,
        mediaItemDetails: {
          id: 'some-id',
          mediaType: 'video',
        },
      };
      cardComponent.props().onClick!(event);
      expect(onClick).not.toHaveBeenCalled();
    });

    describe('populates identifier cache for the page context', () => {
      const createFileIdentifier = (index = 0): FileIdentifier => ({
        id: `b9d94b5f-e06c-4a80-bfda-00000000000${index}`,
        mediaItemType: 'file',
        collectionName: 'MediaServicesSample',
      });

      const createExternalIdentifier = (
        index = 0,
      ): ExternalImageIdentifier => ({
        dataURI: `https://example.com/image${index}.png`,
        mediaItemType: 'external-image',
        name: `https://example.com/image${index}.png`,
      });

      const mountFileCard = async (identifier: FileIdentifier) => {
        const card = mount(
          <MediaCard
            type="file"
            id={await identifier.id}
            collection={identifier.collectionName}
            mediaProvider={{
              viewContext: ContextFactory.create({
                authProvider: jest.fn(),
              }),
            }}
            rendererContext={{
              adDoc: {
                content: [
                  {
                    attrs: {
                      collection: identifier.collectionName,
                      height: 580,
                      id: await identifier.id,
                      type: 'file',
                      width: 1021,
                    },
                    type: 'media',
                  },
                ],
              },
            }}
          />,
        );
        card.setState({ imageStatus: 'complete' });
        return card;
      };

      const mountExternalCard = (indentifier: ExternalImageIdentifier) => {
        const card = mount(
          <MediaCard
            type="external"
            url={indentifier.dataURI}
            mediaProvider={{
              viewContext: ContextFactory.create({
                authProvider: jest.fn(),
              }),
            }}
            rendererContext={{
              adDoc: {
                content: [
                  {
                    attrs: {
                      height: 580,
                      url: indentifier.dataURI,
                      type: 'external',
                      width: 1021,
                    },
                    type: 'media',
                  },
                ],
              },
            }}
          />,
        );
        card.setState({ imageStatus: 'complete' });
        return card;
      };

      it('should have a mediaViewerDataSource if doc is passed for a file card', async () => {
        const fileIdentifier = createFileIdentifier();
        const mediaFileCard = await mountFileCard(fileIdentifier);

        expect(
          mediaFileCard
            .find(Card)
            .at(0)
            .props(),
        ).toHaveProperty('mediaViewerDataSource');
        expect(
          mediaFileCard
            .find(Card)
            .at(0)
            .props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier] });
        mediaFileCard.unmount();
      });

      it('should have a mediaViewerDataSource if doc is passed for an external card', () => {
        const externalIdentifier = createExternalIdentifier();
        const mediaExternalCard = mountExternalCard(externalIdentifier);

        expect(
          mediaExternalCard
            .find(Card)
            .at(0)
            .props(),
        ).toHaveProperty('mediaViewerDataSource');
        expect(
          mediaExternalCard
            .find(Card)
            .at(0)
            .props().mediaViewerDataSource,
        ).toEqual({ list: [externalIdentifier] });
        mediaExternalCard.unmount();
      });

      it('should update the list on re-render if new cards are added', async () => {
        const fileIdentifier = createFileIdentifier(1);
        const externalIdentifier = createExternalIdentifier(1);
        const mediaFileCard = await mountFileCard(fileIdentifier);
        const mediaExternalCard = mountExternalCard(externalIdentifier);

        expect(
          mediaFileCard
            .find(Card)
            .at(0)
            .props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier] });
        expect(
          mediaExternalCard
            .find(Card)
            .at(0)
            .props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier, externalIdentifier] });

        mediaFileCard.setProps({});
        expect(
          mediaFileCard
            .find(Card)
            .at(0)
            .props(),
        ).toHaveProperty('mediaViewerDataSource');
        expect(
          mediaFileCard
            .find(Card)
            .at(0)
            .props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier, externalIdentifier] });
        mediaFileCard.unmount();
        mediaExternalCard.unmount();
      });

      it('should remove card from the list if a card is unmounted', async () => {
        const fileIdentifier0 = createFileIdentifier(2);
        const fileIdentifier1 = createFileIdentifier(3);
        const externalIdentifier0 = createExternalIdentifier(2);
        const externalIdentifier1 = createExternalIdentifier(3);
        const mediaFileCard0 = await mountFileCard(fileIdentifier0);
        const mediaFileCard1 = await mountFileCard(fileIdentifier1);
        const mediaExternalCard0 = mountExternalCard(externalIdentifier0);
        const mediaExternalCard1 = mountExternalCard(externalIdentifier1);

        mediaFileCard0.unmount();
        mediaExternalCard1.unmount();

        mediaFileCard1.setProps({});
        mediaExternalCard0.setProps({});

        expect(
          mediaFileCard1
            .find(Card)
            .at(0)
            .props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier1, externalIdentifier0] });
        expect(
          mediaExternalCard0
            .find(Card)
            .at(0)
            .props().mediaViewerDataSource,
        ).toEqual({ list: [fileIdentifier1, externalIdentifier0] });

        mediaFileCard1.unmount();
        mediaExternalCard0.unmount();
      });
    });
  });
});
