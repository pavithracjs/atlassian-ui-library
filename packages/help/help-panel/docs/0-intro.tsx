import * as React from 'react';
import { md, code, Example, Props } from '@atlaskit/docs';

export default md`
  ## Usage

  ${code`
  import { HelpPanel } from '@atlaskit/help-panel';

  <Navigation
    drawers={[
      <AkSearchDrawer ...props>
        <HelpPanel />
      </AkSearchDrawer>,
    ]}
  </Navigation>
  `}

  ${(
    <Example
      Component={require('../examples/1-Global-Help-In-Drawer').default}
      title="Global Help In Drawer"
      source={require('!!raw-loader!../examples/1-Global-Help-In-Drawer')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/HelpPanel')}
    />
  )}
`;
