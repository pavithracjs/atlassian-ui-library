import * as React from 'react';
import { code, Example, md, Props } from '@atlaskit/docs';
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
  This is the platform field for selecting users. On top of that you can also select [Teams](https://developer.atlassian.com/platform/teams/overview/what-are-teams/).
  This package provides two different modes of selection: single and multi user/team picker.

  ## Usage

  Import the component in your React app as follows:

  ${code`import UserPicker from '@atlaskit/user-picker';`}

  ${(
    <Example
      packageName="@atlaskit/user-picker"
      Component={require('../examples/00-single').default}
      title="Single User Picker"
      source={require('!!raw-loader!../examples/00-single')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/user-picker"
      Component={require('../examples/01-multi').default}
      title="Multi User Picker"
      source={require('!!raw-loader!../examples/01-multi')}
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/user-picker"
      Component={require('../examples/09-watchers').default}
      title="Watchers"
      source={require('!!raw-loader!../examples/09-watchers')}
    />
  )}

  ${(
    <Props
      heading="User Picker Props"
      props={require('!!extract-react-types-loader!../src/components/UserPicker')}
      overrides={{
        createAnalyticsEvent: () => null,
      }}
    />
  )}
`;
