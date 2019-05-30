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
export default class Image {
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
