import * as React from 'react';
jest.mock('../../../service/newUploadServiceImpl');
import { Dropzone } from '../../dropzone/dropzone';
import { mount, ReactWrapper } from 'enzyme';
import { DropzoneDragEnterEventPayload, DropzoneConfig } from '../../types';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

const files = [new File([], '')];

const createDragOverOrDropEvent = (
  eventName: 'dragover' | 'drop' | 'dragleave',
  type?: string,
) => {
  const event = document.createEvent('Event') as any;
  event.initEvent(eventName, true, true);
  event.preventDefault = () => {};
  event.dataTransfer = {
    types: [type || 'Files'],
    effectAllowed: 'move',
    items: [{ kind: 'file' }, { kind: 'string' }],
    files,
  };
  return event;
};

const createDragOverEvent = (type?: string) => {
  return createDragOverOrDropEvent('dragover', type);
};

const createDragLeaveEvent = () => {
  return createDragOverOrDropEvent('dragleave');
};

const createDropEvent = () => {
  return createDragOverOrDropEvent('drop');
};

const containerTypes = ['with', 'with no'];

const mediaClient = fakeMediaClient();

containerTypes.forEach(containerType => {
  describe(`Dropzone ${containerType} supplied container`, () => {
    let spyContainer: HTMLElement;
    let config: DropzoneConfig;
    let component: ReactWrapper;

    beforeEach(() => {
      if (containerType === 'with') {
        const withContainer = document.createElement('DIV');
        config = { container: withContainer, uploadParams: {} };
        spyContainer = withContainer;
      } else {
        config = { uploadParams: {} };
        spyContainer = document.body;
      }
    });

    afterEach(() => {
      if (component.exists()) component.unmount();
    });

    it('adds "dragover", "dragleave" and "drop" events to container', async () => {
      let addEventListenerSpy: jest.SpyInstance<any>;
      addEventListenerSpy = jest.spyOn(spyContainer, 'addEventListener');

      component = mount(<Dropzone mediaClient={mediaClient} config={config} />); // Must mount after syping

      const events = addEventListenerSpy.mock.calls.map(args => args[0]);
      expect(events).toContain('dragover');
      expect(events).toContain('dragleave');
      expect(events).toContain('drop');
    });

    it('removes "dragover", "dragleave" and "drop" events from container', async () => {
      const removeEventListenerSpy = jest.spyOn(
        spyContainer,
        'removeEventListener',
      );

      component = mount(<Dropzone mediaClient={mediaClient} config={config} />); // Must mount after syping
      component.unmount();

      const events = removeEventListenerSpy.mock.calls.map(args => args[0]);
      expect(events).toContain('dragover');
      expect(events).toContain('dragleave');
      expect(events).toContain('drop');
    });

    it('should emit drag-enter for drag over with type "Files" and contain files length', done => {
      component = mount(
        <Dropzone
          mediaClient={mediaClient}
          config={config}
          onDragEnter={(e: DropzoneDragEnterEventPayload) => {
            expect(e.length).toEqual(1);
            done();
          }}
        />,
      );

      spyContainer.dispatchEvent(createDragOverEvent());
    });

    it('should not emit drag-enter for drag over with type "Not Files"', done => {
      component = mount(
        <Dropzone
          mediaClient={mediaClient}
          config={config}
          onDragEnter={() => {
            done(new Error('drag-enter should not be emitted'));
          }}
        />,
      );

      spyContainer.dispatchEvent(createDragOverEvent('Not Files'));
      done();
    });

    it('should emit drag-leave for dragleave event', async done => {
      component = mount(
        <Dropzone
          mediaClient={mediaClient}
          config={config}
          onDragLeave={() => {
            done();
          }}
        />,
      );

      spyContainer.dispatchEvent(createDragOverEvent());
      spyContainer.dispatchEvent(createDragLeaveEvent());
    });

    it('should not emit drag-leave for dragleave event if there was no dragover', () => {
      component = mount(
        <Dropzone
          mediaClient={mediaClient}
          config={config}
          onDragLeave={() => {
            throw new Error('drag-leave should not be emitted');
          }}
        />,
      );

      spyContainer.dispatchEvent(createDragLeaveEvent());
    });

    it('should upload files when files are dropped', () => {
      const component = mount(
        <Dropzone mediaClient={mediaClient} config={config} />,
      );

      const componentInstance = component.instance() as any;
      componentInstance.uploadService.addFiles = jest.fn();

      spyContainer.dispatchEvent(createDropEvent());

      expect(componentInstance.uploadService.addFiles).toHaveBeenCalledTimes(1);
      expect(componentInstance.uploadService.addFiles).toBeCalledWith(files);
    });

    it('should provide a function to onCancelFn callback property and call uploadService.cancel', () => {
      const onCancelFnMock = jest.fn();
      const dropzone = mount(
        <Dropzone
          mediaClient={mediaClient}
          config={config}
          onCancelFn={onCancelFnMock}
        />,
      );
      const instance = dropzone.instance() as Dropzone;
      expect(onCancelFnMock).toBeCalled();
      onCancelFnMock.mock.calls[0][0]();
      expect((instance as any).uploadService.cancel).toBeCalled();
    });
  });
});
