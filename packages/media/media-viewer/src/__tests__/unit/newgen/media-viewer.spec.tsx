const mediaViewerModule = require.requireActual(
  '../../../newgen/analytics/media-viewer',
);
const mediaViewerModalEventSpy = jest.fn();
const mockMediaViewer = {
  ...mediaViewerModule,
  mediaViewerModalEvent: mediaViewerModalEventSpy,
};
jest.mock('../../../newgen/analytics/media-viewer', () => mockMediaViewer);

import * as React from 'react';
import { mount } from 'enzyme';
import { Subject } from 'rxjs/Subject';
import Button from '@atlaskit/button';
import { Shortcut } from '@atlaskit/media-ui';
import { FileItem, Identifier } from '@atlaskit/media-client';
import {
  KeyboardEventWithKeyCode,
  fakeMediaClient,
  asMock,
} from '@atlaskit/media-test-helpers';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { MediaViewer } from '../../../newgen/media-viewer';
import { CloseButtonWrapper } from '../../../newgen/styled';
import Header from '../../../newgen/header';
import { ItemSource } from '../../../newgen/domain';
import { Observable } from 'rxjs';

function createFixture(items: Identifier[], identifier: Identifier) {
  const subject = new Subject<FileItem>();
  const mediaClient = fakeMediaClient();
  asMock(mediaClient.file.getFileState).mockReturnValue(Observable.never());
  const onClose = jest.fn();
  const itemSource: ItemSource = {
    kind: 'ARRAY',
    items,
  };
  const onEvent = jest.fn();
  const el = mount(
    <AnalyticsListener channel="media" onEvent={onEvent}>
      <MediaViewer
        selectedItem={identifier}
        itemSource={itemSource}
        mediaClient={mediaClient}
        onClose={onClose}
      />
    </AnalyticsListener>,
  );
  return { subject, el, onClose, onEvent };
}

describe('<MediaViewer />', () => {
  const identifier: Identifier = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    mediaItemType: 'file',
  };

  it.skip('should close Media Viewer on ESC shortcut', () => {
    const { onClose } = createFixture([identifier], identifier);
    const e = new KeyboardEventWithKeyCode('keydown', {
      bubbles: true,
      cancelable: true,
      keyCode: 27,
    });
    document.dispatchEvent(e);
    expect(onClose).toHaveBeenCalled();
  });

  it('should not close Media Viewer when clicking on the Header', () => {
    const { el, onClose } = createFixture([identifier], identifier);
    el.find(Header).simulate('click');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('should always render the close button', () => {
    const { el, onClose } = createFixture([identifier], identifier);

    expect(el.find(CloseButtonWrapper)).toHaveLength(1);
    el.find(CloseButtonWrapper)
      .find(Button)
      .simulate('click');
    expect(onClose).toHaveBeenCalled();
  });

  describe('Analytics', () => {
    it('should trigger the screen event when the component loads', () => {
      createFixture([identifier], identifier);
      expect(mediaViewerModalEventSpy).toHaveBeenCalled();
    });

    it('should send analytics when closed with button', () => {
      const { el, onEvent } = createFixture([identifier], identifier);

      expect(el.find(CloseButtonWrapper)).toHaveLength(1);
      el.find(CloseButtonWrapper)
        .find(Button)
        .simulate('click');
      expect(onEvent).toHaveBeenCalled();
      const closeEvent: any =
        onEvent.mock.calls[onEvent.mock.calls.length - 1][0];
      expect(closeEvent.payload.attributes.input).toEqual('button');
    });

    it('should send analytics when closed with esc key', () => {
      const { el, onEvent } = createFixture([identifier], identifier);

      expect(el.find(Shortcut)).toHaveLength(1);
      const handler: any = el.find(Shortcut).prop('handler');
      handler({
        keyCode: 27,
      });
      expect(onEvent).toHaveBeenCalled();
      const closeEvent: any =
        onEvent.mock.calls[onEvent.mock.calls.length - 1][0];
      expect(closeEvent.payload.attributes.input).toEqual('escKey');
    });
  });
});
