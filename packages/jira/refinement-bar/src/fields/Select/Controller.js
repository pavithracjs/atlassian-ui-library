// @flow

import React from 'react';
import FieldController from '../Controller';
import { isObject } from '../../utils';

type Options = Array<Object>;

export default class SelectController extends FieldController {
  constructor(...args: *) {
    super(...args);

    // FIXME this would be nice, but shouldn't be inherited by async...
    // if (!this.config.options) {
    //   throw new Error(
    //     'Select type requires an options array or a function that resolves to an array.',
    //   );
    // }

    this.onMenuScrollToBottom = this.config.onMenuScrollToBottom;
    this.onMenuScrollToTop = this.config.onMenuScrollToTop;
    this.options = this.config.options;
    this.placeholder = this.config.placeholder;
  }

  options: Options | (Object => Options);

  onMenuScrollToBottom: ?Function;

  onMenuScrollToTop: ?Function;

  placeholder: ?string;

  hasValue = (value: *) => {
    return Array.isArray(value) ? value.length > 0 : isObject(value);
  };

  getInitialValue = () => [];

  formatLabel = (value: *) => {
    const separator = ', ';
    const max = 3;
    const makeLabel = suffix => (
      <span>
        <strong>{this.label}:</strong> {suffix}
      </span>
    );

    // no value
    if (!this.hasValue(value)) return this.label;

    // value is object
    if (!Array.isArray(value)) return makeLabel(value.label);

    // value is array
    // create comma separated list of values
    // maximum 3 visible
    const valueMap = value.map(v => v.label);
    const valueLength = valueMap.length;

    return makeLabel(
      valueLength > max
        ? `${valueMap.slice(0, max).join(separator)} +${valueLength - max} more`
        : valueMap.join(separator),
    );
  };
}
