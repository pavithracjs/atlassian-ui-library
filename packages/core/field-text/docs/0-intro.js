// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
  ${(
    <SectionMessage
      appearance="warning"
      title="Note: @atlaskit/field-text is being deprecated in favor of @atlaskit/textfield."
    >
      This is part of our forms update which will modernize all our form fields.
    </SectionMessage>
  )}

  Text Field provides a form input.

  ## Usage

${code`
import FieldText, { FieldTextStateless } from '@atlaskit/field-text';
`}

  Text Field exports both a stateful default component, and a stateless component.
  The stateful component manages the value of the input for you and passes all
   other props on to the stateless version.

  ${(
    <Example
      packageName="@atlaskit/field-text"
      Component={require('../examples/00-basic-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-text"
      Component={require('../examples/01-stateless-example').default}
      title="Stateless Example"
      source={require('!!raw-loader!../examples/01-stateless-example')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/field-text"
      Component={require('../examples/02-form-example').default}
      title="Form Example"
      source={require('!!raw-loader!../examples/02-form-example')}
    />
  )}


  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FieldText')}
      heading="FieldText Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/FieldTextStateless')}
      heading="FieldTextStateless Props"
    />
  )}

`;
