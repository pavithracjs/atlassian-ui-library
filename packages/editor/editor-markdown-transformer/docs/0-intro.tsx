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

A Markdown to ProseMirror Node parser.

## Usage

Use the component in your React app as follows:

  ${code`import { MarkdownTransformer } from '@atlaskit/editor-markdown-transformer';
  const transformer = new MarkdownTransformer(schema);
  transfomer.parse(markdown);`}

  ${(
    <Example
      packageName="@atlaskit/editor-markdown-transformer"
      Component={require('../examples/0-markdown-transformer').default}
      title="Markdown Transformer"
      source={require('!!raw-loader!../examples/0-markdown-transformer')}
    />
  )}
`;
