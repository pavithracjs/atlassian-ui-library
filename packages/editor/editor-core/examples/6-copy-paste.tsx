import styled from 'styled-components';
import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import { ReactRenderer } from '@atlaskit/renderer';
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
import { EditorActions, MediaProvider, MediaOptions } from './../src';
import BreadcrumbsMiscActions from '../example-helpers/breadcrumbs-misc-actions';
import {
  defaultCollectionName,
  defaultMediaPickerCollectionName,
  videoFileId,
} from '@atlaskit/media-test-helpers';
import { ProviderFactory } from '@atlaskit/editor-common';

const Wrapper = styled.div`
  box-sizing: border-box;
  height: calc(100vh - 32px);
  display: flex;
`;
const Content = styled.div`
  padding: 0;
  height: 100%;
  width: 50%;
  border: 2px solid #ccc;
  box-sizing: border-box;
`;
const RendererWrapper = styled.div`
  width: 500px;
`;

const getLocalStorageKey = (collectionName: string) =>
  `fabric.editor.example.copypaste-${collectionName}`;
// eslint-disable-next-line no-console
const analyticsHandler = (actionName: string, props?: {}) =>
  console.log(actionName, props);

const LOCALSTORAGE_defaultTitleKey = 'fabric.editor.example.full-page.title';
const createSaveAndCancelButtons = (collectionName: string) => (props: {
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
            getLocalStorageKey(collectionName),
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
        localStorage.removeItem(getLocalStorageKey(collectionName));
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
  mediaOptions: Map<string, Promise<MediaProvider>>;
};
const contextIdentifierProvider = storyContextIdentifierProviderFactory();
const providers: any = {
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
  contextIdentifierProvider,
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

const quickInsertProvider = quickInsertProviderFactory();

export interface ExampleProps {
  onTitleChange?: (title: string) => void;
}

const rendererDoc = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'This is a paragraph with a text node',
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {
        layout: 'full-width',
      },
      content: [
        {
          type: 'media',
          attrs: {
            id: '2aa22582-ca0e-4bd4-b1bc-9369d10a0719',
            type: 'file',
            collection: 'MediaServicesSample',
            width: 5845,
            height: 1243,
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '\n',
        },
        {
          type: 'text',
          text: 'that contains a new line',
        },
      ],
    },
    {
      type: 'mediaSingle',
      attrs: {},
      content: [
        {
          type: 'media',
          attrs: {
            id: videoFileId.id,
            type: 'file',
            collection: 'MediaServicesSample',
            width: 300,
            height: 150,
          },
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: '\n',
        },
        {
          type: 'text',
          text: 'some text bellow the video',
        },
      ],
    },
    {
      type: 'mediaGroup',
      content: [
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '26adc5af-3af4-42a8-9c24-62b6ce0f9369',
            collection: 'MediaServicesSample',
            width: 480,
            height: 320,
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '71cd7e7d-4e86-4b89-a0b4-7f6ffe013c94',
            collection: 'MediaServicesSample',
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '1b01a476-83b4-4f44-8192-f83b2d00913a',
            collection: 'MediaServicesSample',
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: 'a965c8df-1d64-4db8-9de5-16dfa8fd2e12',
            collection: 'MediaServicesSample',
          },
        },
        {
          type: 'media',
          attrs: {
            type: 'file',
            id: '2dfcc12d-04d7-46e7-9fdf-3715ff00ba40',
            collection: 'MediaServicesSample',
          },
        },
      ],
    },
  ],
};
const mediaProvider = getMediaProvider(defaultCollectionName);
const dataProviders = ProviderFactory.create({
  mediaProvider,
  contextIdentifierProvider,
});

class ExampleEditorComponent extends React.Component<
  EditorProps & ExampleProps,
  State
> {
  state: State = {
    disabled: true,
    title: localStorage.getItem(LOCALSTORAGE_defaultTitleKey) || '',
    appearance: 'full-page',
    mediaOptions: new Map(),
  };

  async componentDidMount() {
    const { mediaOptions } = this.state;
    // Simulate adding mediaProvider async
    await new Promise(resolve => setTimeout(resolve, 1000));
    mediaOptions.set(
      defaultCollectionName,
      getMediaProvider(defaultCollectionName),
    );
    mediaOptions.set(
      defaultMediaPickerCollectionName,
      getMediaProvider(defaultMediaPickerCollectionName),
    );
    this.setState({ mediaOptions });
  }

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
    const defaultValue =
      (localStorage &&
        localStorage.getItem(getLocalStorageKey(collectionName))) ||
      undefined;
    const SaveAndCancelButtons = createSaveAndCancelButtons(collectionName);
    const { mediaOptions } = this.state;
    const media: MediaOptions = {
      provider: mediaOptions.get(collectionName),
      allowMediaSingle: true,
      allowResizing: true,
      allowAnnotation: true,
    };

    return (
      <EditorContext key={collectionName}>
        <Content>
          <h2>Editor ({collectionName})</h2>
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
                  media={media}
                  placeholder="Use markdown shortcuts to format your page as you type, like * for lists, # for headers, and *** for a horizontal rule."
                  shouldFocus={false}
                  disabled={this.state.disabled}
                  defaultValue={defaultValue}
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

  renderRenderer = () => {
    return (
      <RendererWrapper>
        <h2>Renderer ({defaultCollectionName})</h2>
        <ReactRenderer
          document={rendererDoc}
          adfStage="stage0"
          dataProviders={dataProviders}
        />
      </RendererWrapper>
    );
  };

  render() {
    return (
      <Wrapper>
        {this.renderEditor(defaultCollectionName)}
        {this.renderEditor(defaultMediaPickerCollectionName)}
        {this.renderRenderer()}
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
