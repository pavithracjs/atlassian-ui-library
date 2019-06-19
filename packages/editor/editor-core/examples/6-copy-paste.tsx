import styled from 'styled-components';
import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import Editor, { EditorProps, EditorAppearance } from './../src/editor';
import EditorContext from './../src/ui/EditorContext';
import WithEditorActions from './../src/ui/WithEditorActions';
import {
  cardProvider,
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
  macroProvider,
  autoformattingProvider,
} from '@atlaskit/editor-test-helpers';
import { mention, emoji, taskDecision } from '@atlaskit/util-data-test';
import { MockActivityResource } from '@atlaskit/activity/dist/es5/support';
import { EmojiProvider } from '@atlaskit/emoji/resource';
import { Provider as SmartCardProvider } from '@atlaskit/smart-card';
import {
  customInsertMenuItems,
  extensionHandlers,
} from '@atlaskit/editor-test-helpers';
import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import { TitleInput } from '../example-helpers/PageElements';
import { EditorActions, MediaProvider } from './../src';
import BreadcrumbsMiscActions from '../example-helpers/breadcrumbs-misc-actions';
import {
  DEFAULT_MODE,
  LOCALSTORAGE_defaultMode,
} from '../example-helpers/example-constants';
import {
  defaultCollectionName,
  defaultMediaPickerCollectionName,
} from '@atlaskit/media-test-helpers';

export const Wrapper: any = styled.div`
  box-sizing: border-box;
  height: calc(100vh - 32px);
  display: flex;
`;
Wrapper.displayName = 'Wrapper';

export const Content: any = styled.div`
  padding: 0;
  height: 100%;
  width: 50%;
  border: 2px solid #ccc;
  box-sizing: border-box;
`;
Content.displayName = 'Content';

// eslint-disable-next-line no-console
export const analyticsHandler = (actionName: string, props?: {}) =>
  console.log(actionName, props);

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
const mediaProviders = new Map<string, Promise<MediaProvider>>();
const getMediaProvider = (collectionName: string): Promise<MediaProvider> => {
  // It's important to keep the same provider instance for Editor
  let provider = mediaProviders.get(collectionName);
  if (provider) {
    return provider;
  } else {
    provider = storyMediaProviderFactory({
      collectionName,
      includeUserAuthProvider: true,
    });

    mediaProviders.set(collectionName, provider);

    return provider;
  }
};

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

class ExampleEditorComponent extends React.Component<
  EditorProps & ExampleProps,
  State
> {
  state: State = {
    disabled: true,
    title: localStorage.getItem(LOCALSTORAGE_defaultTitleKey) || '',
    appearance: this.props.appearance || getAppearance(),
  };

  componentDidUpdate(prevProps: EditorProps) {
    if (prevProps.appearance !== this.props.appearance) {
      this.setState(() => ({
        appearance: this.props.appearance || 'full-page',
      }));
    }
  }

  private setFullWidthMode = (fullWidthMode: boolean) => {
    this.setState({ appearance: fullWidthMode ? 'full-width' : 'full-page' });
  };

  private onKeyPressed = (e: KeyboardEvent, actions: EditorActions) => {
    if (e.key === 'Tab' && !e.shiftKey) {
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

  renderEditor = (collectionName: string) => {
    return (
      <EditorContext key={collectionName}>
        <Content>
          <SmartCardProvider>
            <WithEditorActions
              render={actions => (
                <Editor
                  analyticsHandler={analyticsHandler}
                  allowAnalyticsGASV3={true}
                  quickInsert={{
                    provider: Promise.resolve(quickInsertProvider),
                  }}
                  allowCodeBlocks={{ enableKeybindingsForIDE: true }}
                  allowLists={true}
                  allowTextColor={true}
                  allowTables={{
                    advanced: true,
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
                  allowStatus={true}
                  {...providers}
                  editorActions={actions}
                  media={{
                    provider: getMediaProvider(collectionName),
                    allowMediaSingle: true,
                    allowResizing: true,
                    allowAnnotation: true,
                  }}
                  placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule."
                  shouldFocus={false}
                  disabled={this.state.disabled}
                  defaultValue={
                    (localStorage &&
                      localStorage.getItem(LOCALSTORAGE_defaultDocKey)) ||
                    undefined
                  }
                  contentComponents={
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
                  }
                  primaryToolbarComponents={[
                    <SaveAndCancelButtons
                      key={collectionName}
                      editorActions={actions}
                    />,
                  ]}
                  insertMenuItems={customInsertMenuItems}
                  extensionHandlers={extensionHandlers}
                  {...this.props}
                  appearance={this.state.appearance}
                />
              )}
            />
          </SmartCardProvider>
        </Content>
      </EditorContext>
    );
  };

  render() {
    return (
      <Wrapper>
        {this.renderEditor(defaultCollectionName)}
        {this.renderEditor(defaultMediaPickerCollectionName)}
      </Wrapper>
    );
  }
}

export default function Example(props: EditorProps & ExampleProps) {
  return (
    <div style={{ height: '100%' }}>
      <ExampleEditorComponent {...props} />
    </div>
  );
}
