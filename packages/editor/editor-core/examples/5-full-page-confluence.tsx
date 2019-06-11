import * as React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { ConfluenceIcon } from '@atlaskit/logo';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import { EditorProps } from './../src/editor';
import FullPageExample, { ExampleProps } from './5-full-page';
import { collabEditProvider } from '../example-helpers/mock-collab-provider';
import { InviteToEditButton } from './3-collab';

const App = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  flex: 0 0 64px;
  color: ${colors.N70};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
`;

const EditorWrapper = styled.div`
  flex: 1 1 100%;
`;

/**
 * Example designed to be similar to how the editor is within Confluence's Edit mode
 * Has:
 *  - 64px sidebar on the left
 *  - collab editing enabled
 */
export default class ExampleEditorComponent extends React.Component<
  EditorProps & ExampleProps
> {
  collabSessionId = 'quokka';

  render() {
    return (
      <App>
        <Sidebar>
          <ConfluenceIcon label="Confluence" />
          <QuestionCircleIcon label="Help" />
        </Sidebar>
        <EditorWrapper>
          <FullPageExample
            {...this.props}
            collabEdit={{
              provider: collabEditProvider(this.collabSessionId),
              inviteToEditComponent: InviteToEditButton,
            }}
          />
        </EditorWrapper>
      </App>
    );
  }
}
