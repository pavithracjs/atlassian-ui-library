// @flow
import React from 'react';
import { code, Example, md } from '@atlaskit/docs';

export default md`
This documentation attempts to provide further detail on the various concepts behind the refinement bar.

## Fields

Each field is comprised of a \`Controller\` and a \`View\`.

### Controller

The controller exposes the methods that unify various behaviours by interpreting and rendering data e.g.

\`formatButtonLabel\` describes what the button's label should present to the user.

\`defaultValidation\` this can be overwritten on a per field basis by providing an alternative \`validate\` when the class is instantiated.

\`getInitialValue\` returns the initial value of the field type.

Example Controller

${code`
import React from 'react';
import FieldController from '../Controller';

export default class TextController extends FieldController {
  constructor(config) {
    super(config);

    this.validate = config.validate || this.defaultValidation;
  }

  formatButtonLabel = ({ type, value }) => {
    const exact = type === 'is';
    const notset = type === 'is_not_set';

    const typeLabel = this.getFilterTypes().find(f => f.type === type).label;
    const showType = exact || notset || this.hasValue({ value });
    const showValue = exact || this.hasValue({ value });

    if (!showType && !showValue) {
      return this.label;
    }

    return (
      <span>
        <strong>{this.label}:</strong>
        {showType ? typeLabel : null}
        {showValue ? value : null}
      </span>
    );
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

  defaultValidation = ({ type, value }) => {
    const defaultReturn = null;

    if (type === 'is_not_set') {
      return defaultReturn;
    }
    if (!value) {
      return 'Please provide some text.';
    }

    return defaultReturn;
  };
}
`}
`;
