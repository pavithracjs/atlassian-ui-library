// @flow

import React from 'react';
import FieldController from '../Controller';

export default class TextController extends FieldController {
  constructor(config: *) {
    super(config);
    this.note = config.note;
    this.validate = config.validate || this.defaultValidate;
  }

  note: ?string;

  formatLabel = ({ type, value }: *) => {
    // $FlowFixMe
    const typeLabel = this.getFilterTypes().find(f => f.type === type).label;
    const hasValue = this.hasValue({ type, value });

    if (!hasValue) {
      return this.label;
    }

    return (
      <span>
        <strong>{this.label}: </strong>
        {typeLabel}
        {type !== 'is_not_set' ? ` "${value}"` : null}
      </span>
    );
  };

  hasValue = ({ type, value }: Object) => {
    if (type === 'is_not_set') {
      return true;
    }

    return typeof value === 'string' && value.length;
  };

  getInitialValue = () => ({
    type: 'contains',
    value: '',
  });

  getFilterTypes = () => [
    {
      type: 'contains',
      label: 'contains',
      hasInput: true,
    },
    {
      type: 'not_contains',
      label: 'does not contain',
      hasInput: true,
    },
    {
      type: 'is',
      label: 'exactly matches',
      hasInput: true,
    },
    { type: 'is_not_set', label: 'is empty' },
  ];

  defaultValidate = ({ type, value }: *) => {
    if (type === 'is_not_set') {
      return null;
    }
    if (!value || !value.length) {
      return 'Please provide some text.';
    }

    return null;
  };
}
