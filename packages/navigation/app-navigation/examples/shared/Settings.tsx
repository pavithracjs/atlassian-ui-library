import React from 'react';
import { Settings } from '../../src';

const SettingsContent = () => <div>settings</div>;

const onClick = (...args: any[]) => {
  console.log('settings click', ...args);
};

const onClose = (...args: any[]) => {
  console.log('settings close', ...args);
};

const onDrawerCloseComplete = (...args: any[]) => {
  console.log('settings drawer close complete', ...args);
};

export const DefaultSettings = () => (
  <Settings
    drawerContent={SettingsContent}
    onClick={onClick}
    onClose={onClose}
    onDrawerCloseComplete={onDrawerCloseComplete}
    tooltip="Settings"
  />
);
