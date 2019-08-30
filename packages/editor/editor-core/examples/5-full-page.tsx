import styled from 'styled-components';
import * as React from 'react';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import Button, { ButtonGroup } from '@atlaskit/button';

import {
  cardProvider,
  customInsertMenuItems,
  extensionHandlers,
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
  macroProvider,
  autoformattingProvider,
} from '@atlaskit/editor-test-helpers';

import { EmojiProvider } from '@atlaskit/emoji/resource';
import {
  Provider as SmartCardProvider,
  Client as SmartCardClient,
} from '@atlaskit/smart-card';
import { mention, emoji, taskDecision } from '@atlaskit/util-data-test';

import Editor, { EditorProps, EditorAppearance } from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import { DevTools } from '../example-helpers/DevTools';
import { TitleInput } from '../example-helpers/PageElements';
import { EditorActions } from './../src';
import withSentry from '../example-helpers/withSentry';
import BreadcrumbsMiscActions from '../example-helpers/breadcrumbs-misc-actions';
import {
  DEFAULT_MODE,
  LOCALSTORAGE_defaultMode,
} from '../example-helpers/example-constants';
import { ExampleInlineCommentComponent } from '@atlaskit/editor-test-helpers';

/**
 * +-------------------------------+
 * + [Editor core v] [Full page v] +  48px height
 * +-------------------------------+
 * +                               +  16px padding-top
 * +            Content            +
 * +                               +  16px padding-bottom
 * +-------------------------------+  ----
 *                                    80px - 48px (Outside of iframe)
 */
export const Wrapper: any = styled.div`
  box-sizing: border-box;
  height: 100vh;
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0;
  height: 100%;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

// eslint-disable-next-line no-console
export const analyticsHandler = (actionName: string, props?: {}) =>
  console.log(actionName, props);
// eslint-disable-next-line no-console
const SAVE_ACTION = () => console.log('Save');

export const LOCALSTORAGE_defaultDocKey = 'fabric.editor.example.full-page';
export const LOCALSTORAGE_defaultTitleKey =
  'fabric.editor.example.full-page.title';

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
          // eslint-disable-next-line no-console
          console.log(value);
          localStorage.setItem(
            LOCALSTORAGE_defaultDocKey,
            JSON.stringify(value),
          );
        });
      }}
    >
      Publish
    </Button>
    <Button
      tabIndex={-1}
      appearance="subtle"
      onClick={() => {
        if (!props.editorActions) {
          return;
        }
        props.editorActions.clear();
        localStorage.removeItem(LOCALSTORAGE_defaultDocKey);
        localStorage.removeItem(LOCALSTORAGE_defaultTitleKey);
      }}
    >
      Close
    </Button>
  </ButtonGroup>
);

export type State = {
  disabled: boolean;
  title?: string;
  appearance: EditorAppearance;
};

export const providers: any = {
  emojiProvider: emoji.storyData.getEmojiResource({
    uploadSupported: true,
    currentUser: {
      id: emoji.storyData.loggedUser,
    },
  }) as Promise<EmojiProvider>,
  mentionProvider: Promise.resolve(mention.storyData.resourceProvider),
  taskDecisionProvider: Promise.resolve(
    taskDecision.getMockTaskDecisionResource(),
  ),
  contextIdentifierProvider: storyContextIdentifierProviderFactory(),
  activityProvider: Promise.resolve(new MockActivityResource()),
  macroProvider: Promise.resolve(macroProvider),
  autoformattingProvider: Promise.resolve(autoformattingProvider),
};

export const mediaProvider = storyMediaProviderFactory({
  includeUserAuthProvider: true,
});

export const quickInsertProvider = quickInsertProviderFactory();

export const getAppearance = (): EditorAppearance => {
  return (localStorage.getItem(LOCALSTORAGE_defaultMode) || DEFAULT_MODE) ===
    DEFAULT_MODE
    ? 'full-page'
    : 'full-width';
};

export interface ExampleProps {
  onTitleChange?: (title: string) => void;
}

export class ExampleEditorComponent extends React.Component<
  EditorProps & ExampleProps,
  State
> {
  state: State = {
    disabled: true,
    title: localStorage.getItem(LOCALSTORAGE_defaultTitleKey) || '',
    appearance: this.props.appearance || getAppearance(),
  };

  componentDidMount() {
    // eslint-disable-next-line no-console
    console.log(`To try the macro paste handler, paste one of the following links:

  www.dumbmacro.com?paramA=CFE
  www.smartmacro.com?paramB=CFE
    `);
  }

  componentDidUpdate(prevProps: EditorProps) {
    if (prevProps.appearance !== this.props.appearance) {
      this.setState(() => ({
        appearance: this.props.appearance || 'full-page',
      }));
    }
  }

  render() {
    return (
      <Wrapper>
        <Content>
          <SmartCardProvider client={new SmartCardClient('prod')}>
            <Editor
              analyticsHandler={analyticsHandler}
              allowAnalyticsGASV3={true}
              quickInsert={{ provider: Promise.resolve(quickInsertProvider) }}
              allowCodeBlocks={{ enableKeybindingsForIDE: true }}
              allowLists={true}
              allowTextColor={true}
              allowTables={{
                advanced: true,
                allowColumnSorting: true,
              }}
              allowBreakout={true}
              allowJiraIssue={true}
              allowUnsupportedContent={true}
              allowPanel={true}
              allowExtension={{
                allowBreakout: true,
              }}
              allowRule={true}
              allowDate={true}
              allowLayouts={{
                allowBreakout: true,
                UNSAFE_addSidebarLayouts: true,
              }}
              allowTextAlignment={true}
              allowIndentation={true}
              allowDynamicTextSizing={true}
              allowTemplatePlaceholders={{ allowInserting: true }}
              UNSAFE_cards={{
                provider: Promise.resolve(cardProvider),
              }}
              annotationProvider={{
                component: ExampleInlineCommentComponent,
              }}
              allowStatus={true}
              {...providers}
              media={{
                provider: mediaProvider,
                allowMediaSingle: true,
                allowResizing: true,
                allowAnnotation: true,
                allowLinking: true,
                allowResizingInTables: true,
              }}
              allowHelpDialog
              placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule."
              shouldFocus={false}
              disabled={this.state.disabled}
              defaultValue={
                (localStorage &&
                  localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
                undefined
              }
              contentComponents={
                <WithEditorActions
                  render={actions => (
                    <>
                      <BreadcrumbsMiscActions
                        appearance={this.state.appearance}
                        onFullWidthChange={this.setFullWidthMode}
                      />
                      <TitleInput
                        value={this.state.title}
                        onChange={this.handleTitleChange}
                        innerRef={this.handleTitleRef}
                        onFocus={this.handleTitleOnFocus}
                        onBlur={this.handleTitleOnBlur}
                        onKeyDown={(e: KeyboardEvent) => {
                          this.onKeyPressed(e, actions);
                        }}
                      />
                    </>
                  )}
                />
              }
              primaryToolbarComponents={[
                <WithEditorActions
                  key={1}
                  render={actions => (
                    <SaveAndCancelButtons editorActions={actions} />
                  )}
                />,
              ]}
              onSave={SAVE_ACTION}
              insertMenuItems={customInsertMenuItems}
              extensionHandlers={extensionHandlers}
              {...this.props}
              appearance={this.state.appearance}
            />
          </SmartCardProvider>
        </Content>
      </Wrapper>
    );
  }
  private onKeyPressed = (e: KeyboardEvent, actions: EditorActions) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      // Move to the editor view
      this.setState({
        disabled: false,
      });
      actions.focus();
      return false;
    }
    return;
  };

  private handleTitleChange = (e: KeyboardEvent) => {
    const title = (e.target as HTMLInputElement).value;
    this.setState({
      title,
    });

    if (this.props.onTitleChange) {
      this.props.onTitleChange(title);
    }
  };

  private handleTitleOnFocus = () => this.setState({ disabled: true });
  private handleTitleOnBlur = () => this.setState({ disabled: false });
  private handleTitleRef = (ref?: HTMLElement) => {
    if (ref) {
      ref.focus();
    }
  };

  private setFullWidthMode = (fullWidthMode: boolean) => {
    this.setState({ appearance: fullWidthMode ? 'full-width' : 'full-page' });
  };
}

export const ExampleEditor = withSentry<EditorProps>(ExampleEditorComponent);

export default function Example(props: EditorProps & ExampleProps) {
  return (
    <EditorContext>
      <div style={{ height: '100%' }}>
        <DevTools />
        <ExampleEditor {...props} />
      </div>
    </EditorContext>
  );
}
