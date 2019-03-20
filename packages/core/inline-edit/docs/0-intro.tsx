import * as React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`
  The inline editor is designed to not stand out as an input when it is not
  focused or being interacted with. It is designed to be used as a wrapper
  to control an input component.

  ## Usage

  ${code`
  import InlineEdit from '@atlaskit/inline-edit';
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

`;
