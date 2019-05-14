import * as React from 'react';
import { Component } from 'react';
import {
  createStorybookMediaClient,
  atlassianLogoUrl,
  imageFileId,
} from '@atlaskit/media-test-helpers';
import { ExternalImageIdentifier } from '@atlaskit/media-client';
import { Card } from '../src';
import { ExternalIdentifierWrapper } from '../example-helpers/styled';

const mediaClient = createStorybookMediaClient();
const externalIdentifierWithName: ExternalImageIdentifier = {
  mediaItemType: 'external-image',
  dataURI: atlassianLogoUrl,
  name: 'me',
};
const externalIdentifier: ExternalImageIdentifier = {
  mediaItemType: 'external-image',
  dataURI: atlassianLogoUrl,
};

class Example extends Component {
  render() {
    return (
      <ExternalIdentifierWrapper>
        <div>
          <h2>External image identifier</h2>
          <Card mediaClient={mediaClient} identifier={externalIdentifier} />
        </div>
        <div>
          <h2>External image identifier with name</h2>
          <Card
            mediaClient={mediaClient}
            identifier={externalIdentifierWithName}
          />
        </div>
        <div>
          <h2>File identifier</h2>
          <Card mediaClient={mediaClient} identifier={imageFileId} />
        </div>
      </ExternalIdentifierWrapper>
    );
  }
}

export default () => <Example />;
