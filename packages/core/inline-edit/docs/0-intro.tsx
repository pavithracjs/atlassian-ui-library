import * as React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  The inline edit component is designed to not stand out as an input when it is not
  focused or being interacted with. It is designed to be used as a wrapper
  to control an input component.

  The default exported component requires a custom read view and edit view to be passed in as props.
  If you would like a simple inline edit with a text input, you may be able to use the InlineEditableTextfield component.

  ## Usage

  ${code`
  import InlineEdit, { InlineEditableTextfield } from '@atlaskit/inline-edit';
  `}

  ${(
    <Example
      packageName="@atlaskit/inline-edit"
      Component={require('../examples/00-basic-usage').default}
      title="Basic usage"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/InlineEdit')}
      heading="InlineEdit Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/InlineEditableTextfield')}
      heading="InlineEditableTextfield Props"
    />
  )}

`;
