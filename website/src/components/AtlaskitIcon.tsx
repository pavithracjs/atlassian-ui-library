import React from 'react';
import atlaskitLogo from '../assets/atlaskit-logo-inverted.png';
import atlaskitLogoMonochrome from '../assets/atlaskit-logo-monochrome.png';

export const AtlaskitIcon = ({ monochrome }: { monochrome?: boolean }) => (
  <img
    alt="Atlaskit logo"
    height="24"
    src={monochrome ? atlaskitLogoMonochrome : atlaskitLogo}
    style={{ display: 'block' }}
    width="24"
  />
);
