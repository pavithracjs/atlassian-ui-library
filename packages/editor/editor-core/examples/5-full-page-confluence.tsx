import * as React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import { ConfluenceIcon } from '@atlaskit/logo';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import Spinner from '@atlaskit/spinner';
import { EditorProps, EditorAppearance } from './../src/editor';
import FullPageExample, {
  ExampleProps,
  getAppearance,
  LOCALSTORAGE_defaultDocKey,
} from './5-full-page';
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
  padding: 24px 0;
`;

const EditorWrapper = styled.div`
  flex: 1 1 100%;
`;

const DisabledBlanket = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.03);

  > * {
    margin-top: 50vh;
    margin-left: 50vw;
  }
`;

interface State {
  disabled: boolean;
  appearance: EditorAppearance;
}
/**
 * Example designed to be similar to how the editor is within Confluence's Edit mode
 * Has:
 *  - 64px sidebar on the left
 *  - collab editing enabled
 */
export default class ExampleEditorComponent extends React.Component<
  EditorProps & ExampleProps,
  State
> {
  collabSessionId = 'quokka';

  state = {
    disabled: true,
    appearance: 'full-page' as EditorAppearance,
  };

  componentDidMount() {
    // Simulate async nature of confluence fetching appearance
    const timeout = Math.floor(Math.random() * (1500 - 750 + 1)) + 750;
    console.log(`async delay is ${timeout}`);
    setTimeout(() => {
      this.setState(() => ({ disabled: false, appearance: getAppearance() }));
    }, timeout);
  }

  render() {
    const defaultDoc =
      (localStorage && localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
      undefined;
    return (
      <App>
        <Sidebar>
          <ConfluenceIcon label="Confluence" />
          <QuestionCircleIcon label="Help" />
        </Sidebar>
        <EditorWrapper>
          {this.state.disabled && (
            <DisabledBlanket>
              <Spinner size="large" />
            </DisabledBlanket>
          )}
          <FullPageExample
            {...this.props}
            collabEdit={{
              provider: collabEditProvider(this.collabSessionId, defaultDoc),
              inviteToEditComponent: InviteToEditButton,
            }}
            disabled={this.state.disabled}
            appearance={this.state.appearance}
          />
        </EditorWrapper>
      </App>
    );
  }
}
