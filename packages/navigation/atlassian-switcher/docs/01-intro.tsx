import * as React from 'react';
import { md, code, Example, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
  ${<AtlassianInternalWarning />} 

  \`\`\`<AtlassianSwitcher />\`\`\` is a React app that can be rendered into a container that will show users:

  * The products they have permission to view and navigate to
  * Their recently viewed containers, if applicable
  * Any cross-flow and admin links, if applicable
  * Any custom links from Jira or Confluence, if applicable

  ## Usage

  ${code`import AtlassianSwitcher  from '@atlaskit/atlassian-switcher';`}

  ${(
    <Example
      Component={require('../examples/00-base-example').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-base-example')}
    />
  )}

  ## Internationalisation (i18n)
  
  We use [transifex](https://www.transifex.com/atlassian/atlaskit/dashboard/), along with the rest of AtlasKit to provide i18n.
  
  In order to push or pull i18n changes, you need to:
  
  * Gain access to transifex (Please reach out to component owners)
  * Log in to [transifex](https://www.transifex.com/atlassian/atlaskit/dashboard/) and generate an API key
  * To push i18n changes: Run "\`bolt i18n:push\`" with the API key
  * To pull i18n changes: Run "\`bolt i18n:pull\`" with the API key
  
  If you're pulling i18n changes, ensure to commit the changes to master by raising a PR
   
`;
