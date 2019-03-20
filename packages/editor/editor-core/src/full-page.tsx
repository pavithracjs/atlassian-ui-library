import * as React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { Editor } from './lego/Editor';
import { BaseTheme, akEditorMenuZIndex } from '../../editor-common';
import ContentStyles from './ui/ContentStyles';
import { scrollbarStyles } from './ui/styles';
import { tableFullPageEditorStyles } from './plugins/table/ui/styles';
import { akEditorToolbarKeylineHeight } from './styles';
import { Toolbar } from './lego/Toolbar';
import { EditorContent } from './lego/EditorContent';
import { ContentComponents } from './lego/ContentComponents';
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

export class FullPage extends React.Component {
  render() {
    return (
      <Editor>
        <BaseTheme dynamicTextSizing>
          <FullPageEditorWrapper className="akEditor">
            <MainToolbar showKeyline={true}>
              <Toolbar />
              <MainToolbarCustomComponentsSlot>
                1
              </MainToolbarCustomComponentsSlot>
            </MainToolbar>
            <ScrollContainer className="fabric-editor-popup-scroll-parent">
              <ContentArea>
                <div
                  style={{ padding: `0 ${GUTTER_PADDING}px` }}
                  className="ak-editor-content-area"
                >
                  <EditorContent />
                  <ContentComponents />
                </div>
              </ContentArea>
            </ScrollContainer>
          </FullPageEditorWrapper>
        </BaseTheme>
      </Editor>
    );
  }
}
