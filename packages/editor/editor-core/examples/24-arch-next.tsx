import * as React from 'react';
import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';

import { WithEditorActions, EditorActions } from '../src';
import { TitleArea } from '../example-helpers/PageElements';

/**
 * arch next imports
 */
import { EditorPresetCXHTML } from '../src/labs/next/presets/cxhtml';
import { FullPage as FullPageEditor } from '../src/labs/next/full-page';

export const SaveAndCancelButtons = (props: {
  editorActions?: EditorActions;
}) => (
  <ButtonGroup>
    <Button
      tabIndex={-1}
      appearance="primary"
      onClick={() => {
        if (!props.editorActions) {
          return;
        }

        props.editorActions.getValue().then(value => {
          console.log(value);
        });
      }}
    >
      Publish
    </Button>
    <Button tabIndex={-1} appearance="subtle">
      Close
    </Button>
  </ButtonGroup>
);

export const Wrapper: any = styled.div`
  box-sizing: border-box;
  padding: 2px;
  height: calc(100vh - 32px);
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0 20px;
  height: 100%;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

export default function Example() {
  return (
    <Wrapper>
      <Content>
        <EditorPresetCXHTML>
          <FullPageEditor
            contentComponents={[
              <TitleArea key="title=placeholder" placeholder="Some text..." />,
            ]}
            primaryToolbarComponents={[
              <WithEditorActions
                key="editor-actions-save"
                // tslint:disable-next-line:jsx-no-lambda
                render={actions => (
                  <SaveAndCancelButtons editorActions={actions} />
                )}
              />,
            ]}
            allowDynamicTextSizing={true}
            placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule."
          />
        </EditorPresetCXHTML>
      </Content>
    </Wrapper>
  );
}
