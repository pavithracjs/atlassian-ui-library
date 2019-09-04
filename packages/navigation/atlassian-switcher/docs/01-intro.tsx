import * as React from 'react';
import {
  md,
  code,
  Props,
  Example,
  AtlassianInternalWarning,
} from '@atlaskit/docs';

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

  ## Theming

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/01-standalone-themed-green').default}
      title="Standalone switcher with green theme"
      source={require('!!raw-loader!../examples/01-standalone-themed-green')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/components/switcher')}
    />
  )}
`;
