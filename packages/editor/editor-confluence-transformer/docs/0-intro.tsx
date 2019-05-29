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
This transformer allows encoding ProseMirror Node in CXHTML or converting Confluence HTML to ProseMirror Node.

## Usage

  Use the encoder with editor-confluence-transformer as follows:

  ${code`import { ConfluenceTransformer } from '@atlaskit/editor-confluence-transformer';
  import { confluenceSchema as schema } from '@atlaskit/adf-schema';

  const serializer = new ConfluenceTransformer(schema);
  // To encode editor content as markdown
  serializer.encode(editorContent);
  // To convert HTML to editor content
  serializer.parse(html);`}

  ${(
    <Example
      packageName="@atlaskit/editor-confluence-transformer"
      Component={require('../examples/0-cxhtml-transformer').default}
      title="Cxhtml Transformer"
      source={require('!!raw-loader!../examples/0-cxhtml-transformer')}
    />
  )}
`;
