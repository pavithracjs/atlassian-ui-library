import * as React from 'react';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import { MediaClient, FileIdentifier } from '@atlaskit/media-client';
import {
  mountWithIntlContext,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { MediaCollectionItem } from '@atlaskit/media-store';
import Spinner from '@atlaskit/spinner';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';
import { Collection, Props, State } from '../../../newgen/collection';
import { ErrorMessage } from '../../../newgen/error';
import { List } from '../../../newgen/list';

const collectionName = 'my-collection';

const identifier: any = {
  id: 'some-id',
  occurrenceKey: 'some-custom-occurrence-key',
  mediaItemType: 'file',
};

const identifier2: any = {
  id: 'some-id-2',
  occurrenceKey: 'some-custom-occurrence-key-2',
  mediaItemType: 'file',
};

const mediaCollectionItems: MediaCollectionItem[] = [
  {
    id: identifier.id,
    occurrenceKey: identifier.occurrenceKey || '',
    insertedAt: 1,
    details: {
      artifacts: {},
      mediaType: 'image',
      mimeType: '',
      name: '',
      processingStatus: 'succeeded',
      size: 1,
    },
  },
  {
    id: identifier2.id,
    occurrenceKey: identifier2.occurrenceKey,
    insertedAt: 1,
    details: {
      artifacts: {},
      mediaType: 'image',
      mimeType: '',
      name: '',
      processingStatus: 'succeeded',
      size: 1,
    },
  },
];

function createFixture(
  mediaClient: MediaClient,
  identifier: FileIdentifier,
  onClose?: () => {},
) {
  const el = mountWithIntlContext<Props, State>(
    <Collection
      defaultSelectedItem={identifier}
      collectionName={collectionName}
      mediaClient={mediaClient}
      onClose={onClose}
      pageSize={999}
    />,
  );
  return el;
}

describe('<Collection />', () => {
  it('should show a spinner while requesting items', () => {
    const el = createFixture(fakeMediaClient(), identifier);
    expect(el.find(Spinner)).toHaveLength(1);
  });

  it('should fetch collection items', () => {
    const mediaClient = fakeMediaClient();
    createFixture(mediaClient, identifier);
    expect(mediaClient.collection.getItems).toHaveBeenCalledTimes(1);
    expect(mediaClient.collection.getItems).toHaveBeenCalledWith(
      'my-collection',
      {
        limit: 999,
      },
    );
  });

  it('should show an error if items failed to be fetched', () => {
    const mediaClient = fakeMediaClient();
    (mediaClient.collection as any).getItems = () =>
      new Observable(observer => observer.error());
    const el = createFixture(mediaClient, identifier);
    el.update();
    const errorMessage = el.find(ErrorMessage);
    expect(errorMessage).toHaveLength(1);
    expect(errorMessage.text()).toContain(
      'Something went wrong.It might just be a hiccup.',
    );
  });

  it('should reset the component when the collection prop changes', () => {
    const mediaClient = fakeMediaClient();
    const el = createFixture(mediaClient, identifier);
    expect(mediaClient.collection.getItems).toHaveBeenCalledTimes(1);
    el.setProps({ collectionName: 'other-collection' });
    expect(mediaClient.collection.getItems).toHaveBeenCalledTimes(2);
  });

  it('should reset the component when the context prop changes', () => {
    const mediaClient = fakeMediaClient();
    const el = createFixture(mediaClient, identifier);
    expect(mediaClient.collection.getItems).toHaveBeenCalledTimes(1);

    const context2 = fakeMediaClient();
    el.setProps({ mediaClient: context2 });

    expect(mediaClient.collection.getItems).toHaveBeenCalledTimes(1);
    expect(context2.collection.getItems).toHaveBeenCalledTimes(1);
  });

  it('should restore PENDING state when component resets', () => {
    const subject = new Subject();
    const mediaClient = fakeMediaClient();
    (mediaClient as any).collection.getItems = () => subject;
    const el = createFixture(mediaClient, identifier);
    expect(el.state().items.status).toEqual('PENDING');
    subject.next(mediaCollectionItems);
    expect(el.state().items.status).toEqual('SUCCESSFUL');

    el.setProps({ collectionName: 'other-collection' });
    expect(el.state().items.status).toEqual('PENDING');
  });

  it('MSW-720: adds the collectionName to all identifiers passed to the List component', () => {
    const subject = new Subject();
    const mediaClient = fakeMediaClient();
    (mediaClient as any).collection = {
      getItems: () => subject,
      loadNextPage: jest.fn(),
    };
    const el = createFixture(mediaClient, identifier);
    subject.next(mediaCollectionItems);
    el.update();
    const listProps: any = el.find(List).props();
    expect(listProps.defaultSelectedItem.collectionName).toEqual(
      collectionName,
    );
    listProps.items.forEach((item: any) => {
      expect(item.collectionName).toEqual(collectionName);
    });
  });

  describe('Next page', () => {
    it('should load next page if we instantiate the component with the last item of the page as selectedItem', () => {
      const subject = new Subject();
      const mediaClient = fakeMediaClient();
      (mediaClient as any).collection = {
        getItems: jest.fn().mockReturnValue(subject),
        loadNextPage: jest.fn(),
      };
      createFixture(mediaClient, identifier2);
      subject.next(mediaCollectionItems);
      expect(mediaClient.collection.getItems).toHaveBeenCalledTimes(1);
      expect(mediaClient.collection.loadNextPage).toHaveBeenCalled();
    });

    it('should NOT load next page if we instantiate the component normally', () => {
      const mediaClient = fakeMediaClient();
      createFixture(mediaClient, identifier);
      expect(mediaClient.collection.getItems).toHaveBeenCalledTimes(1);
      expect(mediaClient.collection.loadNextPage).not.toHaveBeenCalled();
    });

    it('should load next page if we navigate to the last item of the list', () => {
      const subject = new Subject();
      const mediaClient = fakeMediaClient();
      (mediaClient as any).collection = {
        getItems: () => subject,
        loadNextPage: jest.fn(),
      };
      const el = createFixture(mediaClient, identifier);
      subject.next(mediaCollectionItems);
      el.update();

      expect(mediaClient.collection.loadNextPage).not.toHaveBeenCalled();
      el.find(ArrowRightCircleIcon).simulate('click');
      expect(mediaClient.collection.loadNextPage).toHaveBeenCalled();
    });
  });
});
