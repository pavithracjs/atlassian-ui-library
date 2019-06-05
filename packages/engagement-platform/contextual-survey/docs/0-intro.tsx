import React from 'react';
import {
  Example,
  Props,
  code,
  md,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';

const BasicExample = require('../examples/00-usage').default;

export default md`
  ${(
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <DevPreviewWarning />
      </div>
    </>
  )}

  This component is used to ask for feedback from the user, without affecting their usage of the page. It is styled similar to a flag.

  Currently, the user flow for this component includes choosing a feedback score, optionally writing extra feedback, and submitting.
  The user may then be prompted on whether they want to sign up to the Atlassian Research Group, depending on if they have already signed up or not.

  After submission (or after signing up to the Atlassian Research Group), the survey will call onDismiss after a short amount of time.

  ## Usage

  ${code`import Avatar from '@atlaskit/avatar';`}

  ${(
    <Example
      packageName="@atlaskit/contextual-survey"
      Component={() => <BasicExample height="500px" />}
      title="Basic example"
      source={require('!!raw-loader!../examples/00-usage')}
    />
  )}

  ${(
    <Props
      heading="Contextual Survey Props"
      props={require('!!extract-react-types-loader!../src/components/ContextualSurvey')}
    />
  )}
`;
