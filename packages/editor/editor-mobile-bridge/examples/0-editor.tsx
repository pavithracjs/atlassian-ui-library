import * as React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import CopyIcon from '@atlaskit/icon/glyph/copy';
import TextArea from '@atlaskit/textarea';
import { colors } from '@atlaskit/theme';
import { disableZooming } from './utils/viewport';

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

export const Toolbar: any = styled.div`
  border-bottom: 1px dashed ${colors.N50};
  padding: 1em;
`;

export const ClipboardZone: any = styled.div`
  max-width: 500px;
  display: flex;
  flex-flow: row;
  align-items: center;
`;

Wrapper.displayName = 'Wrapper';

// @ts-ignore
window.logBridge = window.logBridge || [];

export default class Example extends React.Component {
  private textAreaRef?: HTMLTextAreaElement | null;

  componentDidMount() {
    disableZooming();
  }

  copyToClipboard = () => {
    if (!this.textAreaRef) {
      return;
    }
    this.textAreaRef.select();
    document.execCommand('copy');
  };

  render() {
    return (
      <Wrapper>
        <Toolbar>
          <ClipboardZone>
            <p>Copy to clipboard:</p>
            <TextArea
              data-id="clipboardInput"
              isCompact
              resize="smart"
              forwardedRef={(ref: HTMLTextAreaElement | null) =>
                (this.textAreaRef = ref)
              }
            />
            <Button appearance="subtle" onClick={this.copyToClipboard}>
              <CopyIcon size="medium" label="copy" />
            </Button>
          </ClipboardZone>
        </Toolbar>
        <Editor
          cardProvider={Promise.resolve(cardProvider)}
          mediaProvider={storyMediaProviderFactory({
            collectionName: 'InitialCollectionForTesting',
            includeUserAuthProvider: true,
          })}
          placeholder="Type something here"
        />
      </Wrapper>
    );
  }
}
