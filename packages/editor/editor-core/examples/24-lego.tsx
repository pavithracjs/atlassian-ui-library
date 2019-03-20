import * as React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import Button, { ButtonGroup } from '@atlaskit/button';
import { Editor, PresetProvider } from '../src/lego/Editor';
import { EditorContent } from '../src/lego/EditorContent';
import {
  pastePlugin,
  basePlugin,
  blockTypePlugin,
  placeholderPlugin,
  clearMarksOnChangeToEmptyDocumentPlugin,
  textFormattingPlugin,
  hyperlinkPlugin,
  widthPlugin,
  typeAheadPlugin,
  unsupportedContentPlugin,
  editorDisabledPlugin,
  quickInsertPlugin,
  tablesPlugin,
  codeBlockPlugin,
  panelPlugin,
} from '../src/plugins';
import { tableFullPageEditorStyles } from '../src/plugins/table/ui/styles';
import ContentStyles from '../src/ui/ContentStyles';
import { scrollbarStyles } from '../src/ui/styles';
import { akEditorToolbarKeylineHeight } from '../src/styles';
import { akEditorMenuZIndex, BaseTheme } from '../../editor-common';
import { Toolbar } from '../src/lego/Toolbar';
import { WithEditorActions, EditorActions } from '../src';
import { ContentComponents } from '../src/lego/ContentComponents';
import { TitleArea } from '../example-helpers/PageElements';

const plugins = [
  pastePlugin,
  basePlugin,
  blockTypePlugin,
  placeholderPlugin(
    'Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule.',
  ),
  clearMarksOnChangeToEmptyDocumentPlugin,
  hyperlinkPlugin,
  textFormattingPlugin({}),
  widthPlugin,
  typeAheadPlugin,
  unsupportedContentPlugin,
  editorDisabledPlugin,
  quickInsertPlugin,
  tablesPlugin(),
  codeBlockPlugin(),
  panelPlugin,
];

const FullPageEditorWrapper = styled.div`
  min-width: 340px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;
FullPageEditorWrapper.displayName = 'FullPageEditorWrapper';

const ScrollContainer = styled(ContentStyles)`
  flex-grow: 1;
  overflow-y: scroll;
  position: relative;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  ${scrollbarStyles};
`;
ScrollContainer.displayName = 'ScrollContainer';

const GUTTER_PADDING = 32;

const ContentArea = styled.div`
  line-height: 24px;
  height: 100%;
  width: 100%;
  max-width: ${({ theme }: any) => theme.layoutMaxWidth + GUTTER_PADDING * 2}px;
  padding-top: 50px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 55px;

  & .ProseMirror {
    flex-grow: 1;
    box-sizing: border-box;
  }

  && .ProseMirror {
    & > * {
      clear: both;
    }
    > p,
    > ul,
    > ol,
    > h1,
    > h2,
    > h3,
    > h4,
    > h5,
    > h6 {
      clear: none;
    }
  }
  ${tableFullPageEditorStyles};
`;
ContentArea.displayName = 'ContentArea';

interface MainToolbarProps {
  showKeyline: boolean;
}

const MainToolbar: React.ComponentClass<
  React.HTMLAttributes<{}> & MainToolbarProps
> = styled.div`
  position: relative;
  align-items: center;
  box-shadow: ${(props: MainToolbarProps) =>
    props.showKeyline
      ? `0 ${akEditorToolbarKeylineHeight}px 0 0 ${colors.N30}`
      : 'none'};
  transition: box-shadow 200ms;
  z-index: ${akEditorMenuZIndex};
  display: flex;
  height: 80px;
  flex-shrink: 0;

  & object {
    height: 0 !important;
  }
`;
MainToolbar.displayName = 'MainToolbar';

const MainToolbarCustomComponentsSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;
MainToolbarCustomComponentsSlot.displayName = 'MainToolbar';

const SecondaryToolbar = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  display: flex;
  padding: 24px 0;
`;
SecondaryToolbar.displayName = 'SecondaryToolbar';

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
        <PresetProvider value={plugins}>
          <Editor>
            <BaseTheme dynamicTextSizing>
              <FullPageEditorWrapper className="akEditor">
                <MainToolbar showKeyline={true}>
                  <Toolbar />
                  <MainToolbarCustomComponentsSlot>
                    <WithEditorActions
                      // tslint:disable-next-line:jsx-no-lambda
                      render={actions => (
                        <SaveAndCancelButtons editorActions={actions} />
                      )}
                    />
                  </MainToolbarCustomComponentsSlot>
                </MainToolbar>
                <ScrollContainer className="fabric-editor-popup-scroll-parent">
                  <ContentArea>
                    <div
                      style={{ padding: `0 ${GUTTER_PADDING}px` }}
                      className="ak-editor-content-area"
                    >
                      <TitleArea placeholder="Some text..." />
                      <EditorContent />
                      <ContentComponents />
                    </div>
                  </ContentArea>
                </ScrollContainer>
              </FullPageEditorWrapper>
            </BaseTheme>
          </Editor>
        </PresetProvider>
      </Content>
    </Wrapper>
  );
}
