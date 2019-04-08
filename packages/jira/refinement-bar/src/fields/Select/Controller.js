// @flow

import React, { type Node } from 'react';
import FieldController from '../Controller';
import { isObject } from '../../utils';

export interface SelectControllerInterface {
  config: Object;
  hasValue: (*) => boolean;
  getInitialValue: (*) => any;
  formatButtonLabel: (*) => Node;
  validateOptions: (*) => Object;
  validateValue: (*) => boolean;
}

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

    this.options = this.config.options;
  }
  options: Options | (Object => Options);
  hasValue = (value: *) => {
    return Array.isArray(value) ? value.length > 0 : isObject(value);
  };
  getInitialValue = () => [];
  formatButtonLabel = (value: *) => {
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
        ? `${valueMap.slice(0, max).join(separator)} +${valueLength - 3} more`
        : valueMap.join(separator),
    );
  };

  // Implementation

  validateOptions = (options: *) => {
    let message = null;
    let validity = true;

    if (!Array.isArray(options)) {
      validity = false;
      message = 'Options must be an array.';
    }
    if (options.length > 0 && isObject(options[0])) {
      validity = false;
      message = 'Options array must contain objects.';
    }

    return { message, validity };
  };
}
