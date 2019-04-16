import * as React from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { EditorAppearance, UIComponentFactory } from '../../types';
import { EventDispatcher } from '../../event-dispatcher';
import EditorActions from '../../actions';
import { DispatchAnalyticsEvent } from '../../plugins/analytics';
import { whichTransitionEvent } from '../../utils';

const PluginsComponentsWrapper = styled.div`
  display: flex;
`;

export interface Props {
  items?: Array<UIComponentFactory>;
  editorView?: EditorView;
  editorActions?: EditorActions;
  eventDispatcher?: EventDispatcher;
  providerFactory: ProviderFactory;
  appearance: EditorAppearance;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  containerElement: HTMLElement | undefined;
  disabled: boolean;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  contentArea?: HTMLElement;
}

export default class PluginSlot extends React.Component<Props, any> {
  shouldComponentUpdate(nextProps: Props) {
    const {
      editorView,
      editorActions,
      items,
      providerFactory,
      eventDispatcher,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      containerElement,
      disabled,
    } = this.props;

    return !(
      nextProps.editorView === editorView &&
      nextProps.editorActions === editorActions &&
      nextProps.items === items &&
      nextProps.providerFactory === providerFactory &&
      nextProps.eventDispatcher === eventDispatcher &&
      nextProps.popupsMountPoint === popupsMountPoint &&
      nextProps.popupsBoundariesElement === popupsBoundariesElement &&
      nextProps.popupsScrollableElement === popupsScrollableElement &&
      nextProps.containerElement === containerElement &&
      nextProps.disabled === disabled
    );
  }

  componentDidMount() {
    this.addModeChangeListener(this.props.contentArea);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.contentArea !== nextProps.contentArea) {
      this.addModeChangeListener(nextProps.contentArea);
    }
  }

  componentWillUnmount() {
    const { contentArea } = this.props;
    if (contentArea) {
      contentArea.removeEventListener(
        whichTransitionEvent(),
        this.forceComponentUpdate,
      );
    }
  }

  forceComponentUpdate = (): void => this.forceUpdate();

  addModeChangeListener = (contentArea?: HTMLElement) => {
    if (contentArea) {
      /**
       * Update the plugin components once the transition
       * to full width / default mode completes
       */
      contentArea.addEventListener(
        whichTransitionEvent(),
        this.forceComponentUpdate,
      );
    }
  };

  render() {
    const {
      items,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      appearance,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      containerElement,
      disabled,
      dispatchAnalyticsEvent,
    } = this.props;

    if (!items || !editorView) {
      return null;
    }

    return (
      <PluginsComponentsWrapper>
        {items.map((component, key) => {
          const props: any = { key };
          const element = component({
            editorView: editorView as EditorView,
            editorActions: editorActions as EditorActions,
            eventDispatcher: eventDispatcher as EventDispatcher,
            providerFactory,
            dispatchAnalyticsEvent,
            appearance,
            popupsMountPoint,
            popupsBoundariesElement,
            popupsScrollableElement,
            containerElement,
            disabled,
          });
          return element && React.cloneElement(element, props);
        })}
      </PluginsComponentsWrapper>
    );
  }
}
