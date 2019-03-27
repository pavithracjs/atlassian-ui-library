// @flow

import SelectController from '../Select/Controller';

export default class AsyncSelectController extends SelectController {
  constructor(...args: *) {
    super(...args);
    this.defaultOptions = this.config.defaultOptions;
    this.loadOptions = this.config.loadOptions;
  }
  defaultOptions: *;
  loadOptions: *;
}
