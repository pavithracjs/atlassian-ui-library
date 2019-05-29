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
This transformer allows encoding ProseMirror Node in JSON format.

  ## Usage

  Use the encoder with editor-json-transformer as follows:

  ${code`import { JSONTransformer } from '@atlaskit/editor-json-transformer';
  const serializer = new JSONTransformer(schema);
  serializer.encode(editorContent);`}

  ${(
    <Example
      packageName="@atlaskit/editor-json-transformer"
      Component={require('../examples/0-json-transformer').default}
      title="Json Transformer"
      source={require('!!raw-loader!../examples/0-json-transformer')}
    />
  )}
`;
