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
  This component provides a way to do image annotations.

  ## Usage

  ${code`
  import { MediaEditor } from '@atlaskit/media-editor';
  import { tallImage as imageDataUri } from '@atlaskit/media-test-helpers';

  const App = () => (
    <MediaEditor
      imageUrl={imageDataUri}
      tool={'arrow'}
    />
  );
  `}
  
    ${(
      <Example
        Component={require('../examples/4-smart-media-editor').default}
        title="Fixed Sized"
        source={require('!!raw-loader!../examples/4-smart-media-editor')}
      />
    )}
  
  ${(
    <Props
      heading="Media Editor Props"
      props={require('!!extract-react-types-loader!../src/react/mediaEditor')}
    />
  )}
`;
