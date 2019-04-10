import { code, Example, md, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';
import * as React from 'react';

export default md`
  ${(
    <SectionMessage appearance="warning">
      <p>
        This package requires an existance of IntlProvider Component from
        react-intl or your application will be broken.
      </p>
    </SectionMessage>
  )}
  
  ${<br />}
  
  ${(
    <SectionMessage appearance="warning">
      <p>
        This package has an opinion on showing flag(s) upon successful share,
        and it does not provide any Flag system. Instead, showFlag prop is
        available for this purpose.
      </p>
    </SectionMessage>
  )}

  This package provides the view components allowing users to share a resource by
  sharing with User Picker, or by copying the share link.
  
  The goal is to provide a consistent share experience across the product.
  
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
