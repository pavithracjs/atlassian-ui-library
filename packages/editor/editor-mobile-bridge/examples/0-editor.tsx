import * as React from 'react';
import styled from 'styled-components';

import {
  cardProvider,
  storyMediaProviderFactory,
} from '@atlaskit/editor-test-helpers';

import Editor from './../src/editor/mobile-editor-element';

export const Wrapper: any = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

Wrapper.displayName = 'Wrapper';

// @ts-ignore
window.logBridge = window.logBridge || [];

export default class Example extends React.Component {
  render() {
    return (
      <Wrapper>
        <Editor
          cardProvider={Promise.resolve(cardProvider)}
          mediaProvider={storyMediaProviderFactory({
            collectionName: 'InitialCollectionForTesting',
            includeUserAuthProvider: true,
          })}
        />
      </Wrapper>
    );
  }
}
