import * as React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';

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
  Turns a URL into a card with metadata sourced from either:

  - a vendor or...
  - a custom fetch function that can be provided.

  _Note_: this package uses an AbortController, so you might need to provide a polyfill for that.

  ## Usage

  ${code`import { Provider, Card } from '@atlaskit/smart-card';`}

  ${(
    <Example
      Component={require('../examples/0-intro').default}
      title="An editable example"
      source={require('!!raw-loader!../examples/0-intro')}
    />
  )}

${(
  <Props
    heading="renderCardWithData Props"
    props={require('!!extract-react-types-loader!../src/view/CardWithData')}
  />
)}

`;
