// @flow

import React from 'react';
import FieldController from '../Controller';
import { isObject, objectMap } from '../../utils';

const validateInput = (label, value, name) => {
  let result = null;
  const prefix = name ? `${label} "${name}"` : label;

  if (Number.isNaN(value)) {
    result = `${prefix} must be a number`;
  } else if (!Number.isInteger(value)) {
    result = `${prefix} must be a whole number`;
  } else if (value < 0) {
    result = `${prefix} must be a positive number`;
  }

  return result;
};

export default class NumberController extends FieldController {
  constructor(config: *) {
    super(config);
    this.note = config.note;
    this.validate = config.validate || this.defaultValidate;
  }

  note: ?string;

  formatLabel = ({ type, value }: *) => {
    // $FlowFixMe
    const typeLabel = this.getFilterTypes().find(f => f.type === type).label;
    const showValue = type !== 'is_not_set';
    const valueLabel = isObject(value)
      ? Object.values(value).join(' and ')
      : value;

    if (!this.hasValue({ type, value })) {
      return this.label;
    }

    return (
      <span>
        <strong>{this.label}:</strong> {typeLabel}
        {showValue ? ` ${valueLabel}` : null}
      </span>
    );
  };

  hasValue = ({ type, value }: Object) => {
    if (type === 'is_not_set') return true;

    let bool = typeof value === 'number';

    if (isObject(value)) {
      Object.values(value).forEach(v => {
        bool = typeof v === 'number';
      });
    }

    return bool;
  };

  getInitialValue = () => ({
    type: 'is',
    value: '',
  });

  getFilterTypes = () => [
    { type: 'is', label: 'is', hasInput: true },
    {
      type: 'not',
      label: 'is not',
      hasInput: true,
    },
    {
      type: 'gt',
      label: 'greater than',
      hasInput: true,
    },
    {
      type: 'lt',
      label: 'less than',
      hasInput: true,
    },
    {
      type: 'between',
      label: 'between',
      hasInput: true,
    },
    { type: 'is_not_set', label: 'has no value' },
  ];

  defaultValidate = ({ type, value }: *) => {
    let result = null;
    const nameMap = { lt: 'to', gt: 'from' };

    if (type === 'is_not_set') {
      return result;
    }

    if (isObject(value)) {
      // make sure both values are present
      if (value.lt === undefined || value.gt === undefined) {
        return 'Both inputs are required.';
      }

      // check for a valid range
      if (value.lt <= value.gt) {
        return 'Invalid range; the second input must be greater than the first.';
      }

      objectMap(value, (val, key) => {
        const r = validateInput(this.label, val, nameMap[key]);
        if (r) result = r;
        return null;
      });
    } else {
      result = validateInput(this.label, value);
    }

    return result;
  };
}
