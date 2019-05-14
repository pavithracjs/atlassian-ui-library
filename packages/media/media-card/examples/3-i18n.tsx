import * as React from 'react';
import {
  I18NWrapper,
  errorFileId,
  createStorybookMediaClient,
} from '@atlaskit/media-test-helpers';
import { Card } from '../src';

const mediaClient = createStorybookMediaClient();

export default () => (
  <I18NWrapper>
    <Card mediaClient={mediaClient} identifier={errorFileId} />
  </I18NWrapper>
);
