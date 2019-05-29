import * as React from 'react';
import { md, code, Example } from '@atlaskit/docs';
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
  \`notification-log-client\` is a fetch client implementation for making API calls to notification-log service.

  This is intended to be used as a provider into other components, such as NotificationIndicator.

  ## Usage

  ${code`import { NotificationLogClient } from '@atlaskit/notification-log-client';

  const notificationLogClient = new NotificationLogClient(
    'http://base-url-to-notification-log-service',
    'cloudid-abcd-1234-5678',
  );

  const result = await notificationLogClient.countUnseenNotifications();
  console.log(result.count);`}

  ${(
    <Example
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}
`;
