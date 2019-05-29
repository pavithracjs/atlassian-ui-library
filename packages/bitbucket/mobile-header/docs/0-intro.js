// @flow
import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';
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
  The Mobile Header is a way to render a header that hides the Navigation and Sidebar
  from smaller screens and allows the user to view them by tapping/clicking icons.

  ## Usage

  ${code`import MobileHeader from '@atlaskit/mobile-header';`}

  ${(
    <Example
      packageName="@atlaskit/mobile-header"
      Component={require('../examples/01-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/01-basic')}
    />
  )}

  ${(
    <Props
      heading="Mobile Header Props"
      props={require('!!extract-react-types-loader!../src/components/MobileHeader')}
    />
  )}
`;
