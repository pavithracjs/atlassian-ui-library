// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  ### Usage

  This package exports an number of different Avatar related components
  \`\`\`js
  import Avatar, { AvatarGroup, AvatarItem, Presence, Status } from '@atlaskit/avatar';
  \`\`\`

  Use the \`Avatar\` component to represent users with their
  profile picture. Optionally, a presence to indicate online status can also
  be displayed.

  You can use the \`Presence\` component independently for contexts
  where the profile picture is not required (e.g. next to a username)

  ${(
    <Example
      Component={require('../examples/0-basicAvatar').default}
      title="Avatar"
      source={require('!!raw-loader!../examples/0-basicAvatar')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/1-basicAvatarGroup').default}
      title="AvatarGroup"
      source={require('!!raw-loader!../examples/1-basicAvatarGroup')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/2-basicAvatarItem').default}
      title="Presence"
      source={require('!!raw-loader!../examples/2-basicAvatarItem')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/3-basicPresence').default}
      title="Presence"
      source={require('!!raw-loader!../examples/3-basicPresence')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/4-basicStatus').default}
      title="Status"
      source={require('!!raw-loader!../examples/4-basicStatus')}
    />
  )}

  ## Props

  > Currently this is not provided as we are experiencing a flow type generation issue
`;
