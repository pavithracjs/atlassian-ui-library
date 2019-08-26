import * as React from 'react';
import { disableZooming } from './utils/viewport';

import {
  cardProvider,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';

import Editor from './../src/editor/mobile-editor-element';

// @ts-ignore
window.logBridge = window.logBridge || [];

export default class Example extends React.Component {
  componentDidMount() {
    disableZooming();
  }

  render() {
    return (
      <Editor
        cardProvider={Promise.resolve(cardProvider)}
        mediaProvider={storyMediaProviderFactory({
          collectionName: 'InitialCollectionForTesting',
          includeUserAuthProvider: true,
        })}
        placeholder="Type something here"
      />
    );
  }
}
