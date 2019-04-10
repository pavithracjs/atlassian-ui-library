// @flow

import React from 'react';
import FieldController from '../Controller';
import { isObject, objectMap } from '../../utils';

const validateInput = (label, value, name) => {
  let message = null;
  let isInvalid = false;
  const prefix = name ? `${label} "${name}"` : label;

  if (Number.isNaN(value)) {
    message = `${prefix} must be a number`;
    isInvalid = true;
  } else if (!Number.isInteger(value)) {
    message = `${prefix} must be a whole number`;
    isInvalid = true;
  } else if (value < 0) {
    message = `${prefix} must be a positive number`;
    isInvalid = true;
  }

  return { message, isInvalid };
};

export default class NumberController extends FieldController {
  constructor(config: *) {
    super(config);
    this.validateValue = config.validateValue || this.defaultValidation;
  }

  formatButtonLabel = ({ type, value }: *) => {
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
      type: `between`,
      label: 'between',
      hasInput: true,
    },
    { type: 'is_not_set', label: 'has no value' },
  ];

  // Implementation

  defaultValidation = ({ type, value }: *) => {
    let result = { message: null, isInvalid: false };
    const nameMap = { lt: 'to', gt: 'from' };

    if (type === 'is_not_set') {
      return result;
    }

    if (isObject(value)) {
      // make sure both values are present
      if (value.lt === undefined || value.gt === undefined) {
        return {
          message: 'Both inputs are required.',
          isInvalid: true,
        };
      }

      // check for a valid range
      if (value.lt <= value.gt) {
        return {
          message:
            'Invalid range; the second input must be greater than the first.',
          isInvalid: true,
        };
      }

      objectMap(value, (val, key) => {
        const r = validateInput(this.label, val, nameMap[key]);
        if (r.isInvalid) result = r;
        return null;
      });
    } else {
      result = validateInput(this.label, value);
    }

    return result;
  };
}
