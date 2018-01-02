// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  ### Usage

  The inline editor is designed to not stand out as an input when it is not
  focused or being interacted with. It is designed to be used as a wrapper
  to control an input component 

  ~~~js
  import InlineEditor, { InlineEdit } from '@atlaskit/inline-edit';
  ~~~

  The stateful inline editor manages the ~~~onEditRequested~~~,{' '}
  ~~~onCancel~~~, and ~~~onConfirm~~~ events and exposes{' '}
  ~~~onCancel~~~ and ~~~onConfirm~~~ handlers. All other props
  passed to the ~~~InlineEditor~~~ component are passed directly
  through to the stateless ~~~InlineEdit~~~ component.

  ${(
    <Example
      Component={require('../examples/00-basic-usage').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic-usage')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/01-stateless-example').default}
      title="Stateless Example"
      source={require('!!raw-loader!../examples/01-stateless-example')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/02-select-example').default}
      title="Form Example"
      source={require('!!raw-loader!../examples/02-select-example')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/03-waiting-example').default}
      title="Form Example"
      source={require('!!raw-loader!../examples/03-waiting-example')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/04-mention-example').default}
      title="Form Example"
      source={require('!!raw-loader!../examples/04-mention-example')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/InlineEdit')}
      heading="InlineEdit Props"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/InlineEditStateless')}
      heading="InlineEditStateless Props"
    />
  )}

`;
