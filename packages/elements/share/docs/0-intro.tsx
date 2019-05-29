import { code, Example, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';
import * as React from 'react';

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
        This package requires to be wrapped by IntlProvider Component from
        react-intl or your application will break when this comoponent is
        rendered.
      </p>
    </SectionMessage>
  )}

  This package provides the view components allowing users to share a resource by
  sharing with User Picker, or by copying the share link.
  
  The goal is to provide a consistent share experience across products.
  
  ## Usage 
  
  Import the component in your React app as follows:
  
  ${code`import ShareDialogContainer from '@atlaskit/share;`}
  
  ${(
    <Example
      packageName="@atlaskit/share"
      Component={require('../examples/00-integration-with-configs').default}
      title="Example"
      source={require('!!raw-loader!../examples/00-integration-with-configs')}
    />
  )}
 
  ${(
    <Props
      heading="Share Props"
      props={require('!!extract-react-types-loader!../src/components/ShareDialogContainer')}
    />
  )}
`;
