import {
  LocalUploadComponentReact,
  LocalUploadComponentBaseProps,
} from './localUploadReact';

import {
  DropzoneConfig,
  DropzoneDragEnterEventPayload,
  DropzoneDragLeaveEventPayload,
  DropzoneUploadEventPayloadMap,
} from './types';

const toArray = (arr: any) => [].slice.call(arr, 0);

export type DropzoneReactProps = LocalUploadComponentBaseProps & {
  config: DropzoneConfig;
  onDrop?: () => void;
  onDragEnter?: (payload: DropzoneDragEnterEventPayload) => void;
  onDragLeave?: (payload: DropzoneDragLeaveEventPayload) => void;
};

function dragContainsFiles(event: DragEvent): boolean {
  if (!event.dataTransfer) {
    return false;
  }
  const { types } = event.dataTransfer;
  return toArray(types).indexOf('Files') > -1;
}

export class DropzoneReact extends LocalUploadComponentReact<
  DropzoneReactProps,
  DropzoneUploadEventPayloadMap
> {
  private uiActive: boolean = false;

  constructor(props: DropzoneReactProps) {
    super(props);
  }

  private getContainer(): HTMLElement {
    const {
      config: { container },
    } = this.props;
    return container || document.body;
  }

  public componentDidMount() {
    this.removeContainerListeners(); // in case we call activate twice in a row?
    this.addContainerListeners();
  }

  public componentWillUnmount(): void {
    this.removeContainerListeners();
  }

  private addContainerListeners = () => {
    this.getContainer().addEventListener('dragover', this.onDragOver, false);
    this.getContainer().addEventListener('dragleave', this.onDragLeave, false);

    this.getContainer().addEventListener('drop', this.onFileDropped);
  };

  private removeContainerListeners = () => {
    this.getContainer().removeEventListener('dragover', this.onDragOver, false);
    this.getContainer().removeEventListener(
      'dragleave',
      this.onDragLeave,
      false,
    );

    this.getContainer().removeEventListener('drop', this.onFileDropped);
  };

  private onDragOver = (e: DragEvent): void => {
    e.preventDefault();

    if (e.dataTransfer && dragContainsFiles(e)) {
      const dataTransfer = e.dataTransfer;
      let allowed;

      try {
        allowed = dataTransfer.effectAllowed;
      } catch (e) {} // the error is expected in IE11

      dataTransfer.dropEffect =
        'move' === allowed || 'linkMove' === allowed ? 'move' : 'copy';
      const length = this.getDraggedItemsLength(dataTransfer);
      this.emitDragOver({ length });
    }
  };

  private onDragLeave = (e: DragEvent): void => {
    if (e.dataTransfer) {
      e.preventDefault();
      let length = 0;
      if (dragContainsFiles(e)) {
        const dataTransfer = e.dataTransfer;
        length = this.getDraggedItemsLength(dataTransfer);
      }
      this.emitDragLeave({ length });
    }
  };

  private readonly onFileDropped = (dragEvent: DragEvent) => {
    if (!dragEvent.dataTransfer) {
      return;
    }

    dragEvent.preventDefault();
    dragEvent.stopPropagation();
    this.onDrop(dragEvent);

    const filesArray = [].slice.call(dragEvent.dataTransfer.files);
    this.uploadService.addFiles(filesArray);
  };

  // Cross-browser way of getting dragged items length, we prioritize "items" if present
  // https://www.w3.org/TR/html51/editing.html#the-datatransfer-interface
  // This method is used on 'dragover' and we have no way to retrieve FileSystemFileEntry,
  // which contains info about if the dropped item is a file or directory. That info is only
  // available on 'drop'
  private getDraggedItemsLength(dataTransfer: DataTransfer): number {
    if (dataTransfer.items) {
      const items = toArray(dataTransfer.items);
      return items.filter((i: DataTransferItem) => i.kind === 'file').length;
    }
    // This is required for IE11
    return dataTransfer.files.length;
  }

  private onDrop = (e: DragEvent): void => {
    if (e.dataTransfer && dragContainsFiles(e)) {
      const dataTransfer = e.dataTransfer;
      const length = this.getDraggedItemsLength(dataTransfer);
      if (this.props.onDrop) this.props.onDrop();
      this.emitDragLeave({ length });
    }
  };

  private emitDragOver(e: DropzoneDragEnterEventPayload): void {
    if (!this.uiActive) {
      const { onDragEnter } = this.props;
      this.uiActive = true;
      if (onDragEnter) onDragEnter(e);
    }
  }

  private emitDragLeave(payload: DropzoneDragLeaveEventPayload): void {
    if (this.uiActive) {
      this.uiActive = false;
      /*
       when drag over child elements, container will issue dragleave and then dragover immediately.
       The 50ms timeout will prevent from issuing that "false" dragleave event
       */
      window.setTimeout(() => {
        if (!this.uiActive) {
          const { onDragLeave } = this.props;
          if (onDragLeave) onDragLeave(payload);
        }
      }, 50);
    }
  }

  render() {
    return null;
  }
}
