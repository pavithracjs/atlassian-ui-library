import { auth } from '../..';

let authWindow: Window;

// https://github.com/jsdom/jsdom/blob/master/lib/api.js#L199
const windowOptions = { resourceLoader: {} };

describe('auth()', () => {
  beforeEach(() => {
    // @ts-ignore Window Options exist in JSDOM but not in browser DOM.
    authWindow = new Window(windowOptions);
    window.open = () => {
      return authWindow;
    };
  });

  it('should reject when the window is closed', () => {
    window.open = () => {
      // @ts-ignore Window Options exist in JSDOM but not in browser DOM.
      const win = new Window(windowOptions);
      Object.defineProperty(win, 'closed', { value: true });
      Object.defineProperty(win, 'close', { value: jest.fn() });
      return win;
    };

    const promise = auth('/');

    return expect(promise).rejects.toMatchObject({
      message: 'The auth window was closed',
    });
  });

  it('should reject when the message indiciates failure', () => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:failure',
          message: 'Where was the earth shattering kaboom?',
        },
        source: authWindow,
      }),
    );

    return expect(promise).rejects.toMatchObject({
      message: 'Where was the earth shattering kaboom?',
    });
  });

  it('should not reject when the message indicates success and is from another window', done => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:success',
        },
        // @ts-ignore Window Options exist in JSDOM but not in browser DOM.
        source: new Window(windowOptions),
      }),
    );

    promise.then(() => done.fail(), () => done.fail());

    window.setTimeout(() => {
      expect(true).toBe(true);
      done();
    }, 500);
  });

  it('should not reject when the message indicates failure and is from another window', done => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:failure',
          message: 'Uh oh.',
        },
        // @ts-ignore Window Options exist in JSDOM but not in browser DOM.
        source: new Window(windowOptions),
      }),
    );

    promise.then(() => done.fail(), () => done.fail());

    window.setTimeout(() => {
      expect(true).toBe(true);
      done();
    }, 500);
  });

  it('should resolve when the message indicates success and it is from the same window', () => {
    const promise = auth('/');

    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: 'outbound-auth:success',
        },
        source: authWindow,
      }),
    );

    return expect(promise).resolves.toBeUndefined();
  });
});
