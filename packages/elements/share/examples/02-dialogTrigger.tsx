import Button from '@atlaskit/button';
import * as React from 'react';
import { ShareDialogWithTrigger } from '../src/components/ShareDialogWithTrigger';

const loadUserOptions = () => [];
const onShareSubmit = () => Promise.resolve({});
const showFlags = () => {};

export default () => (
  <React.Fragment>
    <h4>Default share button</h4>
    <ShareDialogWithTrigger
      copyLink="copyLink"
      loadUserOptions={loadUserOptions}
      onShareSubmit={onShareSubmit}
      shareContentType="page"
      showFlags={showFlags}
    />
    <h4>Default share button with text</h4>
    <ShareDialogWithTrigger
      copyLink="copyLink"
      loadUserOptions={loadUserOptions}
      onShareSubmit={onShareSubmit}
      shareContentType="page"
      showFlags={showFlags}
      triggerButtonStyle="icon-with-text"
    />
    <h4>Custom share button</h4>
    <ShareDialogWithTrigger
      copyLink="copyLink"
      loadUserOptions={loadUserOptions}
      onShareSubmit={onShareSubmit}
      shareContentType="page"
      showFlags={showFlags}
    >
      {openDialog => <Button onClick={openDialog}>Custom Button</Button>}
    </ShareDialogWithTrigger>
  </React.Fragment>
);
