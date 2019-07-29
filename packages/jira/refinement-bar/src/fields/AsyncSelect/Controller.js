// @flow

import SelectController from '../Select/Controller';

type Options = Array<Object>;

export default class AsyncSelectController extends SelectController {
  constructor(...args: *) {
    super(...args);

    this.cacheOptions = this.config.cacheOptions;
    this.defaultOptions = this.config.defaultOptions;
    this.defaultOptionsLabel = this.config.defaultOptionsLabel;
    this.inputValue = this.config.inputValue;
    this.loadOptions = this.config.loadOptions;
    this.onInputChange = this.config.onInputChange;
  }

  cacheOptions: ?any;

  defaultOptions: ?Options;

  defaultOptionsLabel: ?string;

  inputValue: ?string;

  loadOptions: (inputValue: string) => Options;

  onInputChange: ?Function;
}
