import * as React from 'react';
import { md, code, Example } from '@atlaskit/docs';

export default md`
  The switcher supports a limited set of customizations through the atlaskit theming api. The following properties are exposed:
  - primaryTextColor: text color used on the main text of each item
  - secondaryTextColor: text color used on the secondary text of some items
  - primaryHoverBackgroundColor: background color used on hover state for top level and child items
  - secondaryTextColor: background color used on passive hover state for top level and default background for child items

  ${code`
// MyComponent.js
import React from 'react';
import Switcher, { createCustomTheme } from '@atlaskit/atlassian-switcher"';

export default (props) => {
  const myTheme = {
    primaryTextColor: colors.text,
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

  Check it an example below:

  ${(
    <Example
      packageName="@atlaskit/atlassian-switcher"
      Component={
        require('../examples/02-inline-dialog-theming-example').default
      }
      title="Rendered on an inline dialog with theming"
      source={require('!!raw-loader!../examples/02-inline-dialog-theming-example')}
    />
  )}
`;
