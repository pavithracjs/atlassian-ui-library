import { EditorView } from 'prosemirror-view';

type ImageDimensions = { width: number; height: number };

/**
 * Converts the current image src in the form of http://some/url/128x256.png
 * into an object with the shape `{ width: number, height: number }`
 */
function getImageDimensions(src: string): ImageDimensions | null {
  if (src.length) {
    const splitUrl = src.split('/');
    const filename = splitUrl[splitUrl.length - 1];
    const [dimensions] = filename.split('.', 2);
    const [width, height] = dimensions.split('x').map(Number);

    return { width, height };
  }

  return null;
}

/**
 * Provides a mock HTMLImageElement that supports urls of the form
 * http://some.domain/path/to/mock/image/128x256.png
 *
 * Only `load` and `error` events are currently supported.
 */
export class Image {
  private _src: string = '';
  private dimensions: ImageDimensions | null = null;

  private eventListeners: Partial<
    Record<keyof HTMLElementEventMap, Set<((...args: any) => void)>>
  > = {};

  private onEvents: Partial<
    Record<keyof HTMLElementEventMap, (...args: any) => void>
  > = {};

  constructor(width?: number, height?: number) {
    if (width && height) {
      this.dimensions = { width, height };
    }
  }

  set onload(cb: (...args: any) => void) {
    this.onEvents.load = cb;
  }

  set onerror(cb: (...args: any) => void) {
    this.onEvents.error = cb;
  }

  private fireEvent(name: keyof HTMLElementEventMap, ...args: any) {
    const onEvent = this.onEvents[name];
    if (onEvent) {
      onEvent(args);
    }

    const eventListeners = this.eventListeners[name];
    if (eventListeners) {
      for (const listener of eventListeners) {
        listener(args);
      }
    }
  }

  addEventListener<K extends keyof HTMLElementEventMap>(
    eventName: K,
    cb: ((...args: any) => void),
  ) {
    let eventSet = this.eventListeners[eventName];
    if (!eventSet) {
      eventSet = this.eventListeners[eventName] = new Set();
    }

    eventSet.add(cb);
  }

  removeEventListener<K extends keyof HTMLElementEventMap>(
    eventName: K,
    cb: ((...args: any) => void),
  ) {
    let eventSet = this.eventListeners[eventName];
    if (!eventSet) {
      return;
    }

    eventSet.delete(cb);
  }

  set src(src: string) {
    this._src = src;

    if (!src) {
      this.fireEvent('error');
      return;
    }

    // re-trigger "loading" the image
    this.dimensions = getImageDimensions(src);
    if (this.dimensions) {
      this.fireEvent('load');
    } else {
      this.fireEvent('error');
    }
  }

  get src() {
    return this._src;
  }

  get width() {
    return this.dimensions && this.dimensions.width;
  }

  get naturalWidth() {
    return this.dimensions && this.dimensions.width;
  }

  get height() {
    return this.dimensions && this.dimensions.height;
  }

  get naturalHeight() {
    return this.dimensions && this.dimensions.height;
  }
}

export class NullSelectionReader {
  constructor(private warnOnce: () => void) {}

  destroy() {}
  poll() {}
  editableChanged() {}

  // : () → bool
  // Whether the DOM selection has changed from the last known state.
  domChanged() {
    this.warnOnce();
    return true;
  }

  // Store the current state of the DOM selection.
  storeDOMState(_selection: any) {
    this.warnOnce();
  }

  clearDOMState() {
    this.warnOnce();
  }

  // : (?string) → bool
  // When the DOM selection changes in a notable manner, modify the
  // current selection state to match.
  readFromDOM(_origin: any) {
    this.warnOnce();
    return true;
  }
}

export default (editorView: any) => {
  const warnOnce = (() => {
    return () => {
      if ((window as any).hasWarnedAboutJsdomFixtures) {
        return;
      }

      // eslint-disable-next-line no-console
      console.warn(
        'Warning! Test depends on DOM selection API which is not supported in JSDOM/Node environment.',
      );

      (window as any).hasWarnedAboutJsdomFixtures = true;
    };
  })();

  // Ignore all DOM document selection changes and do nothing to update it
  (editorView as any).selectionReader = new NullSelectionReader(warnOnce);

  // Make sure that we don't attempt to scroll down to selection when dispatching a transaction
  (editorView as any).updateState = function(state: any) {
    warnOnce();
    state.scrollToSelection = 0;
    EditorView.prototype.updateState.apply(this, arguments as any);
  };

  // Do nothing to update selection
  (editorView as any).setSelection = function(
    _anchor: any,
    _head: any,
    _root: any,
  ) {
    warnOnce();
  };

  (editorView as any).destroy = function() {
    EditorView.prototype.destroy.apply(this, arguments as any);
  };
};
