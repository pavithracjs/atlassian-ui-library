import { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import React, { Fragment } from 'react';

import { Help } from '../../src';

const HelpContent = () => (
  <Fragment>
    <DropdownItemGroup title="Help">
      <DropdownItem>Atlassian Documentation</DropdownItem>
      <DropdownItem>Atlassian Community</DropdownItem>
      <DropdownItem>What's New</DropdownItem>
      <DropdownItem>Get Jira Mobile</DropdownItem>
      <DropdownItem>Keyboard shortcuts</DropdownItem>
      <DropdownItem>About Jira</DropdownItem>
    </DropdownItemGroup>
    <DropdownItemGroup title="Legal">
      <DropdownItem>Terms of use</DropdownItem>
      <DropdownItem>Privacy Policy</DropdownItem>
    </DropdownItemGroup>
  </Fragment>
);

const onClick = (...args: any[]) => {
  console.log('help click', ...args);
};

const onClose = (...args: any[]) => {
  console.log('help close', ...args);
};

export const DefaultHelp = () => (
  <Help
    dropdownContent={HelpContent}
    onClick={onClick}
    onClose={onClose}
    tooltip="Help"
  />
);
