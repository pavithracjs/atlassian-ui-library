import * as React from 'react';
import { md, Example, code } from '@atlaskit/docs';
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

This package provides a transformer for ProseMirror Node <-> Wikimarkup conversion.
  ## Usage

  Use the component in your React app as follows:

  ${code`import { WikiMarkupTransformer } from '@atlaskit/editor-wikimarkup-transformer';
  const transformer = new WikiMarkupTransformer(schema);
  const pmNode = transformer.parse(wikiMarkup);`}

  ${(
    <Example
      packageName="@atlaskit/editor-wikimarkup-transformer"
      Component={require('../examples/0-adf-to-wikimarkup').default}
      title="ADF to Wikimarkup"
      source={require('!!raw-loader!../examples/0-adf-to-wikimarkup')}
    />
  )}
`;
