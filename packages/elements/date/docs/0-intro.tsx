import * as React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';
import DateStyledExample from '../examples/01-date-with-style';
import CustomColorExample from '../examples/00-custom-colors';
import CustomFormatExample from '../examples/02-custom-format';

const DateStyledSource = require('!!raw-loader!../examples/01-date-with-style');
const CustomColorSource = require('!!raw-loader!../examples/00-custom-colors');
const CustomFormatSource = require('!!raw-loader!../examples/02-custom-format');

const DateProps = require('!!extract-react-types-loader!../src/components/Date');

export default md`
${(
  <SectionMessage appearance="warning">
    <p>
      <strong>
        Note: This component is designed for internal Atlassian development.
      </strong>
    </p>
    <p>
      External contributors will be able to use this component but will not be
      able to submit issues.
    </p>
  </SectionMessage>
)}
This component is the implementation of the Date element in React.

## Usage

  ${code`import { Date, Color } from '@atlaskit/date';`}

  ${(
    <Example
      packageName="@atlaskit/date"
      Component={DateStyledExample}
      title="Date"
      source={DateStyledSource}
    />
  )}

  ${<Props props={DateProps} />}

  ### You can also use Date lozenge
  Lozenge is available in the [ADG3 Lozenge colors](https://atlassian.design/guidelines/product/components/lozenges).


  \`color\` prop is optional and has the following option \`'grey' | 'red' | 'blue' | 'green' | 'purple' | 'yellow'\`.
  
  ${(
    <Example
      Component={CustomColorExample}
      source={CustomColorSource}
      title="Custom colors examples"
      language="javascript"
    />
  )}
  
  You can also specify custom format for the date. We use [date-fns](https://date-fns.org/). Check out [format function
  documentation](https://date-fns.org/v1.29.0/docs/format).
  
  ${(
    <Example
      Component={CustomFormatExample}
      source={CustomFormatSource}
      title="Custom format examples"
      language="javascript"
    />
  )}
`;
