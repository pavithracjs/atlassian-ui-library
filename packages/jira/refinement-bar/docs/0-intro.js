//@flow

import * as React from 'react';
import { md, code, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

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
${(
  <SectionMessage appearance="warning">
    <p>
      <strong>
        Note: @atlaskit/refinement-bar is currently a developer preview.
      </strong>
    </p>
    <p>
      Please experiment with and test this package, but be aware that the API
      may change at any time. Use at your own risk, preferrably not in
      production.
    </p>
  </SectionMessage>
)}

## Usage

${code`
  import { RefinementBar } from '@atlaskit/refinement-bar';
`}

${(
  <Example
    packageName="@atlaskit/refinement-bar"
    Component={require('../examples/00-refinement-bar').default}
    source={require('!!raw-loader!../examples/00-refinement-bar')}
    title="Basic Usage"
    language="jsx"
  />
)}

${(
  <Props
    heading="Refinement bar props"
    props={require('!!extract-react-types-loader!../src/components/RefinementBar')}
  />
)}
`;
