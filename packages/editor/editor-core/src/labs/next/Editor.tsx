import * as React from 'react';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import * as PropTypes from 'prop-types';
import { EditorPlugin, EditorAppearanceComponentProps } from '../../types';
import EditorContext from '../../ui/EditorContext';
import { EditorContentProvider } from './EditorContent';
import {
  EventDispatcher,
  createDispatch,
  Dispatch,
} from '../../event-dispatcher';
import {
  processPluginsList,
  createPMPlugins,
  createSchema,
} from '../../create-editor/create-editor';
import { intlShape, IntlProvider } from 'react-intl';
import {
  PortalProvider,
  PortalRenderer,
  PortalProviderAPI,
} from '../../ui/PortalProvider';
import {
  ProviderFactory,
  WidthProvider,
  Transformer,
} from '@atlaskit/editor-common';
import { EditorState } from 'prosemirror-state';
import { EditorActions } from '../../index';
import { processRawValue } from '../../utils';
import {
  basePlugin,
  placeholderPlugin,
  editorDisabledPlugin,
  typeAheadPlugin,
  floatingToolbarPlugin,
  gapCursorPlugin,
} from '../../plugins';

export type EditorProps = {
  plugins?: Array<EditorPlugin>;
  transformer?: (schema: Schema) => Transformer<string>;
  children?: React.ReactChild;

  // Set the default editor content.
  defaultValue?: string | object;

  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;

  disabled?: boolean;
  placeholder?: string;
};

export type EditorPropsExtended = EditorProps & {
  portalProviderAPI: PortalProviderAPI;
};

const {
  Provider: PresetProvider,
  Consumer: PresetConsumer,
} = React.createContext<Array<EditorPlugin>>([]);

export { PresetProvider };

export function corePlugins(props: EditorProps) {
  return [
    basePlugin({
      allowInlineCursorTarget: true,
      allowScrollGutter: () =>
        document.querySelector('.fabric-editor-popup-scroll-parent'),
    }),
    placeholderPlugin({ placeholder: props.placeholder }),
    editorDisabledPlugin(),
    typeAheadPlugin(),
    floatingToolbarPlugin(),
    gapCursorPlugin(),
  ];
}

export interface EditorSharedConfig {
  editorView: EditorView;
  eventDispatcher: EventDispatcher;
  dispatch: Dispatch;

  primaryToolbarComponents: EditorAppearanceComponentProps['primaryToolbarComponents'];
  contentComponents: EditorAppearanceComponentProps['contentComponents'];

  popupsMountPoint: EditorProps['popupsMountPoint'];
  popupsBoundariesElement: EditorProps['popupsBoundariesElement'];
  popupsScrollableElement: EditorProps['popupsScrollableElement'];
  providerFactory: EditorAppearanceComponentProps['providerFactory'];

  disabled: EditorProps['disabled'];
}

export class Editor extends React.Component<EditorProps> {
  render() {
    return (
      <PresetConsumer>
        {plugins => (
          <PortalProvider
            render={portalProviderAPI => (
              <IntlProvider locale="en">
                <>
                  <EditorInternal
                    {...this.props}
                    plugins={corePlugins(this.props).concat(
                      this.props.plugins || [],
                      plugins,
                    )}
                    portalProviderAPI={portalProviderAPI}
                  />
                  <PortalRenderer portalProviderAPI={portalProviderAPI} />
                </>
              </IntlProvider>
            )}
          />
        )}
      </PresetConsumer>
    );
  }
}

export class EditorInternal extends React.Component<
  EditorPropsExtended,
  EditorSharedConfig
> {
  editorActions: EditorActions;

  static contextTypes = {
    editorActions: PropTypes.object,
    intl: intlShape,
  };

  constructor(props: EditorPropsExtended, context: any) {
    super(props);
    this.editorActions = (context || {}).editorActions || new EditorActions();
  }

  handleRef = (ref: HTMLDivElement | null) => {
    if (!ref) {
      return;
    }

    const eventDispatcher = new EventDispatcher();
    const providerFactory = new ProviderFactory();
    const dispatch = createDispatch(eventDispatcher);
    const editorConfig = processPluginsList(this.props.plugins || [], {});
    const schema = createSchema(editorConfig);
    const pmPlugins = createPMPlugins({
      editorConfig,
      schema,
      dispatch,
      eventDispatcher,
      props: {},
      portalProviderAPI: this.props.portalProviderAPI,
      providerFactory,
      reactContext: () => this.context,
      dispatchAnalyticsEvent: () => {},
    });
    const state = EditorState.create({
      schema,
      plugins: pmPlugins,
      doc: processRawValue(schema, this.props.defaultValue),
    });
    const editorView = new EditorView({ mount: ref }, { state });

    // Editor Shared Config
    this.setState({
      editorView,

      eventDispatcher,
      dispatch,

      primaryToolbarComponents: editorConfig.primaryToolbarComponents,
      contentComponents: editorConfig.contentComponents,

      popupsMountPoint: this.props.popupsMountPoint,
      popupsBoundariesElement: this.props.popupsBoundariesElement,
      popupsScrollableElement: this.props.popupsScrollableElement,

      disabled: this.props.disabled,
      providerFactory,
    });

    this.editorActions._privateRegisterEditor(editorView, eventDispatcher);
  };

  render() {
    return (
      <WidthProvider>
        <EditorContext editorActions={this.editorActions}>
          <EditorSharedConfigProvider value={this.state}>
            <EditorContentProvider value={this.handleRef}>
              {this.props.children}
            </EditorContentProvider>
          </EditorSharedConfigProvider>
        </EditorContext>
      </WidthProvider>
    );
  }
}

const { Provider, Consumer } = React.createContext<EditorSharedConfig | null>(
  null,
);

export class EditorSharedConfigProvider extends React.Component<
  { value: EditorSharedConfig | null },
  any
> {
  static childContextTypes = {
    editorSharedConfig: PropTypes.object,
  };

  getChildContext() {
    return {
      editorSharedConfig: this.props.value,
    };
  }

  render() {
    return <Provider value={this.props.value}>{this.props.children}</Provider>;
  }
}

interface EditorSharedConfigConsumerProps {
  children: (value: EditorSharedConfig | null) => React.ReactNode | null;
}
export class EditorSharedConfigConsumer extends React.Component<
  EditorSharedConfigConsumerProps
> {
  static contextTypes = {
    editorSharedConfig: PropTypes.object,
  };

  render() {
    return (
      <Consumer>
        {value => this.props.children(this.context.editorSharedConfig || value)}
      </Consumer>
    );
  }
}
