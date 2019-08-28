import * as React from 'react';
import { md, code, Example } from '@atlaskit/docs';
import details from './switcher-theming.png';

export default md`
  The switcher supports a limited set of customizations through the atlaskit theming api. The following properties are exposed:
  - primaryTextColor: text color used on the main text of each item
  - secondaryTextColor: text color used on the secondary text of some items
  - primaryHoverBackgroundColor: background color used on hover state for top level and child items
  - secondaryTextColor: background color used on passive hover state for top level and default background for child items

  ### Spec:
  ${<img src={details} />}

  ### Usage:
  ${code`
  // MyComponent.js
  import React from 'react';
  import Switcher, { createCustomTheme } from '@atlaskit/atlassian-switcher"';

  export default (props) => {
    const myTheme = {
      primaryTextColor: '#000080',
      secondaryTextColor: '#03396c',
      primaryHoverBackgroundColor: '#ccffff',
      secondaryHoverBackgroundColor: '#e5ffff',
    };

    const customTheme = createCustomTheme(myTheme);

    return (
      <Switcher
        {...props}
        theme={customTheme}
        }}
      />
    );
  }
  `}

  ### Examples:

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/01-standalone').default}
      title="Standalone switcher"
      source={require('!!raw-loader!../examples/01-standalone')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/01-standalone-themed-green').default}
      title="Standalone switcher with green theme"
      source={require('!!raw-loader!../examples/01-standalone-themed-green')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={require('../examples/01-standalone-themed-red').default}
      title="Standalone switcher with red theme"
      source={require('!!raw-loader!../examples/01-standalone-themed-red')}
    />
  )}

`;
