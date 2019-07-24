/**
 * Forked the code of `jest-environment-jsdom-fourteen` into this file.
 * (https://github.com/ianschmitz/jest-environment-jsdom-fourteen/blob/master/src/index.ts)
 *
 * This customised JSDOM 14 environment for Jest adds the option "resourceLoaderOptions" to initialize JSDOM with a User-Agent.
 *
 * Example of a Jest config passing a User-Agent:
 * {
 *   testEnvironment: `${__dirname}/build/jest-config/setup-jsdom-environment.js`,
 *   testEnvironmentOptions: {
 *     resourceLoaderOptions: {
 *       userAgent: USER_AGENT,
 *     },
 *   },
 * }
 *
 * Asides, moved the custom error listener into a closure to improve readability of the original code.
 */
const { JestFakeTimers } = require('@jest/fake-timers');
const mock = require('jest-mock');
const { installCommonGlobals } = require('jest-util');
const { JSDOM, ResourceLoader, VirtualConsole } = require('jsdom');

function getMockedEventListeners(global) {
  const {
    addEventListener: origAddEventListener,
    removeEventListener: origRemoveEventListener,
  } = global;

  let userErrorListenerCount = 0;

  return {
    addEventListener: function(...args) {
      if (args[0] === 'error') {
        userErrorListenerCount++;
      }
      origAddEventListener.apply(this, args);
    },
    removeEventListener: function(...args) {
      if (args[0] === 'error') {
        userErrorListenerCount--;
      }
      origRemoveEventListener.apply(this, args);
    },
    errorEventListener: event => {
      if (userErrorListenerCount === 0 && event.error) {
        process.emit('uncaughtException', event.error);
      }
    },
  };
}

class JSDOMEnvironment {
  constructor(config, opts = {}) {
    const { testEnvironmentOptions, testURL } = config;
    const { resources, resourceLoaderOptions } = testEnvironmentOptions;

    this.dom = new JSDOM('<!DOCTYPE html>', {
      pretendToBeVisual: true,
      runScripts: 'dangerously',
      url: testURL,
      virtualConsole: new VirtualConsole().sendTo(opts.console || console),
      resources:
        typeof resourceLoaderOptions === 'object'
          ? new ResourceLoader(resourceLoaderOptions)
          : resources,
    });

    const global = (this.global = this.dom.window.document.defaultView);

    if (!global) {
      throw new Error('JSDOM did not return a Window object');
    }

    // Node's error-message stack size is limited at 10, but it's pretty useful
    // to see more than that when a test fails.
    global.Error.stackTraceLimit = 100;

    installCommonGlobals(global, config.globals);

    // Report uncaught errors.
    // However, don't report them as uncaught if the user listens to 'error' event.
    // In that case, we assume the might have custom error handling logic.
    const {
      addEventListener,
      removeEventListener,
      errorEventListener,
    } = getMockedEventListeners(global);

    global.addEventListener(
      'error',
      (this.errorEventListener = errorEventListener),
    );
    global.addEventListener = addEventListener;
    global.removeEventListener = removeEventListener;

    this.moduleMocker = new mock.ModuleMocker(global);
    this.fakeTimers = new JestFakeTimers({
      config,
      global,
      moduleMocker: this.moduleMocker,
      timerConfig: {
        idToRef: id => id,
        refToId: ref => ref,
      },
    });
  }

  setup() {
    return Promise.resolve();
  }

  // @see https://github.com/ianschmitz/jest-environment-jsdom-fourteen/blob/v0.1.0/src/index.ts#L86
  teardown() {
    if (this.fakeTimers) {
      this.fakeTimers.dispose();
    }

    if (this.global) {
      if (this.errorEventListener) {
        this.global.removeEventListener('error', this.errorEventListener);
        this.errorEventListener = undefined;
      }

      // Dispose "document" to prevent "load" event from triggering.
      Object.defineProperty(this.global, 'document', { value: null });
      this.global.close();
    }

    this.dom = undefined;
    this.global = undefined;
    this.fakeTimers = undefined;
    this.moduleMocker = undefined;

    return Promise.resolve();
  }

  runScript(script) {
    if (this.dom) {
      return this.dom.runVMScript(script);
    }
    return null;
  }
}

module.exports = JSDOMEnvironment;
