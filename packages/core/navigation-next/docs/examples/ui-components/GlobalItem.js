// @flow

import React from 'react';
import Avatar from '@atlaskit/avatar';
import { AtlassianIcon } from '@atlaskit/logo';
import SearchIcon from '@atlaskit/icon/glyph/search';
import HelpIcon from '@atlaskit/icon/glyph/question';
import { B500 } from '@atlaskit/theme/colors';
import { GlobalItem } from '../../../src';

export default () => (
  <div
    css={{
      alignItems: 'center',
      backgroundColor: B500,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 8px',
      width: '56px',
    }}
  >
    <GlobalItem icon={() => <AtlassianIcon size="medium" />} />
    <GlobalItem icon={SearchIcon} />
    <GlobalItem icon={HelpIcon} size="small" />
    <GlobalItem
      icon={() => (
        <Avatar
          borderColor="transparent"
          isActive={false}
          isHover={false}
          size="small"
        />
      )}
      size="small"
    />
  </div>
);
