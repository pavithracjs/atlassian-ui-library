/*
 * wrapper on top of webdriver-io apis to give a feel of puppeeteer api
 */

const WAIT_TIMEOUT = 5000;

const { UNICODE_CHARACTERS } = require('webdriverio/build/constants');

const TODO = () => {
  throw new Error('To be implemented!');
};

export class JSHandle {
  constructor(client, selector) {
    this.browser = client;
    this.selector = selector;
  }

  async getElem() {
    if (!this.elem) {
      this.elem = await this.browser.$(this.selector);
    }

    return this.elem;
  }

  asElement() {
    return new ElementHandle(this.browser, this.selector);
  }

  async getProperty(propertyName) {
    const elem = await this.getElem();
    return this.elem.getAttribute(propertyName);
  }

  dispose = TODO;
  executionContext = TODO;
  getProperties = TODO;
  jsonValue = TODO;
}

export class ElementHandle extends JSHandle {
  $ = TODO;
  $$ = TODO;
  $x = TODO;
  asElement = TODO;
  boundingBox = TODO;
  click = TODO;
  dispose = TODO;
  executionContext = TODO;
  focus = TODO;
  getProperties = TODO;
  hover = TODO;
  jsonValue = TODO;
  press = TODO;
  screenshot = TODO;
  tap = TODO;
  toString = TODO;
  type = TODO;
  uploadFile = TODO;
}

export default class Page {
  constructor(client) {
    this.browser = client;
  }

  // Navigation
  goto(url) {
    return this.browser.url(url);
  }

  title() {
    return this.browser.getTitle();
  }

  $(selector) {
    return new ElementHandle(this.browser, selector);
  }

  $$(selector) {
    return this.browser.$$(selector);
  }

  $eval(selector, pageFunction) {
    return this.browser.execute(
      `return (${pageFunction}(document.querySelector("${selector}")))`,
    );
  }

  count(selector) {
    return this.$$(selector).then(function(result) {
      return result.length;
    });
  }

  async type(selector, text) {
    const elem = await this.browser.$(selector);

    let input = text;
    if (!Array.isArray(text)) {
      input = [text];
    }

    for (let txt of input) {
      if (UNICODE_CHARACTERS[txt] && this.browser.isW3C) {
        await this.browser.keys(txt);
      } else {
        await elem.addValue(txt);
      }
    }
  }

  async setValue(selector, text) {
    const elem = await this.browser.$(selector);
    return elem.setValue(text);
  }

  async addValue(selector, text) {
    const elem = await this.browser.$(selector);
    return elem.addValue(text);
  }

  async click(selector) {
    const elem = await this.browser.$(selector);
    return elem.click();
  }

  keys(value) {
    return this.browser.keys(value);
  }

  debug() {
    return this.browser.debug();
  }

  // Get
  async getProperty(selector, cssProperty) {
    const elem = await this.browser.$(selector);
    return elem.getCSSProperty(cssProperty);
  }

  async getLocation(selector, property) {
    const elem = await this.browser.$(selector);
    return elem.getLocation(property);
  }

  getSession() {
    return this.browser.getSession();
  }

  url() {
    return this.browser.getUrl();
  }

  // Protocol
  goBack() {
    return this.browser.back();
  }

  close() {
    return this.browser.close();
  }
  checkConsoleErrors() {
    // Console errors can only be checked in Chrome
    if (this.isBrowser('chrome') && this.browser.getLogs('browser')) {
      this.browser.getLogs('browser').forEach(val => {
        assert.notEqual(
          val.level,
          'SEVERE',
          `Those console errors :${val.message} are displayed`,
        );
      });
    }
  }
  backspace(selector) {
    this.browser.execute(selector => {
      return document
        .querySelector(selector)
        .trigger({ type: 'keydown', which: 8 });
    }, selector);
  }

  // To be replaced by those puppeeter functions
  //  keyboard.down('KeyA');
  //  keyboard.press('KeyA');
  //  keyboard.up('Shift');

  //will need to have wrapper for these once moved to puppeteer
  async getText(selector) {
    // replace with await page.evaluate(() => document.querySelector('p').textContent)
    // for puppteer
    const elem = await this.browser.$(selector);
    return elem.getText();
  }

  getBrowserName() {
    return this.browser.capabilities.browserName.toLowerCase();
  }

  getOS() {
    if (this.browser.capabilities.platformName) {
      return this.browser.capabilities.platformName.toLowerCase();
    }

    if (this.browser.capabilities.platform === 'XP') {
      return 'windows';
    }

    if (this.browser.capabilities.os) {
      return this.browser.capabilities.os.toLowerCase();
    }

    return '';
  }

  isBrowser(browserName) {
    return this.getBrowserName() === browserName.toLowerCase();
  }

  async getCssProperty(selector, cssProperty) {
    const elem = await this.browser.$(selector);
    return elem.getCSSProperty(cssProperty);
  }

  getElementSize(selector) {
    return this.browser.getElementSize(selector);
  }

  async getHTML(selector) {
    const elem = await this.browser.$(selector);
    return elem.getHTML();
  }

  async isEnabled(selector) {
    const elem = await this.browser.$(selector);
    return elem.isEnabled();
  }

  async isExisting(selector) {
    const elem = await this.browser.$(selector);
    return elem.isExisting();
  }

  async isVisible(selector) {
    const elem = await this.browser.$(selector);
    return elem.isDisplayed();
  }

  async hasFocus(selector) {
    const elem = await this.browser.$(selector);
    return elem.isFocused();
  }

  log(type) {
    return this.browser.getLogs(type);
  }

  paste() {
    let keys;
    if (this.isBrowser('chrome')) {
      // Workaround for https://bugs.chromium.org/p/chromedriver/issues/detail?id=30
      keys = ['Shift', 'Insert', 'Shift'];
    } else if (this.getOS() === 'windows') {
      keys = ['Control Left', 'v'];
    } else {
      keys = ['Command', 'v'];
    }

    return this.browser.keys(keys);
  }

  copy() {
    let keys;
    if (this.getOS() === 'windows') {
      keys = ['Control Left', 'c'];
    } else if (this.isBrowser('chrome')) {
      // Workaround for https://bugs.chromium.org/p/chromedriver/issues/detail?id=30
      keys = ['Control Left', 'Insert'];
    } else {
      keys = ['Command', 'c'];
    }

    return this.browser.keys(keys);
  }

  // Wait
  async waitForSelector(selector, options = {}) {
    const elem = await this.browser.$(selector);
    return elem.waitForExist(options.timeout || WAIT_TIMEOUT);
  }

  async waitForVisible(selector, options = {}) {
    const elem = await this.browser.$(selector);
    return elem.waitForDisplayed(
      options.timeout || WAIT_TIMEOUT,
      options.reverse || false,
    );
  }

  waitFor(selector, timeout, reverse) {
    return this.waitForVisible(selector, { timeout, reverse });
  }

  waitUntil(predicate) {
    return this.browser.waitUntil(predicate, WAIT_TIMEOUT);
  }

  // Window
  setViewPort(size) {
    return this.browser.setWindowSize(size.width, size.height);
  }

  mockDate(timestamp, timezoneOffset) {
    return this.browser.execute(
      (t, tz) => {
        const _Date = Date;
        const realDate = params => new _Date(params);
        const mockedDate = new _Date(t);

        if (tz) {
          const localDateOffset = new _Date().getTimezoneOffset() / 60;
          const dateWithTimezoneOffset = new _Date(
            t + (tz + localDateOffset) * 3600000,
          );
          const localDateMethods = [
            'getFullYear',
            'getYear',
            'getMonth',
            'getDate',
            'getDay',
            'getHours',
            'getMinutes',
          ];
          localDateMethods.forEach(dateMethod => {
            mockedDate[dateMethod] = () => dateWithTimezoneOffset[dateMethod]();
          });
        }

        Date = function(...params) {
          if (params.length > 0) {
            return realDate(...params);
          }
          return mockedDate;
        };
        Object.getOwnPropertyNames(_Date).forEach(property => {
          Date[property] = _Date[property];
        });
        Date.now = () => t;
      },
      timestamp,
      timezoneOffset,
    );
  }
}
//TODO: Maybe wrapping all functions?
async function wrapper(fn) {
  return fn;
}
