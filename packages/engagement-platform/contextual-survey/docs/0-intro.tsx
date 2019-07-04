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

  This component is used to ask for feedback from the user, without affecting their usage of the page. It is styled similar to a \`flag\`.

  The user flow for this component is:

  1. Choosing a feedback score
  2. **(Optional)** Writing extra feedback in a \`textarea\`
  3. Submitting
  4. **(Conditional)** Asking the user if they want to sign up to the Atlassian Research group. This step is skipped if \`onMailingListAnswer\` resolves to \`true\`

  After submission (or after signing up to the Atlassian Research Group), the survey will call \`onDismiss\` automatically after a short amount of time.
  \`onDismiss\` is also called if the component is unmounted mid flow. \`onDismiss\` will only ever be called once.

  - \`<SurveyMarshal/>\`: Responsible for placement and animation for the survey
  - \`<ContextualSurvey/>\`: Renders the survey questions

  ## Usage

  ${code`import { ContextualSurvey, SurveyMarshal } from '@atlaskit/avatar';`}

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

${(
  <Props
    heading="Survey Marshal Props"
    props={require('!!extract-react-types-loader!../src/components/SurveyMarshal')}
  />
)}
`;
