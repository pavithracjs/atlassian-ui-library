import * as React from 'react';
import styled from 'styled-components';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import ContentStyles from '../ContentStyles';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import {
  pluginKey as maxContentSizePluginKey,
  MaxContentSizePluginState,
} from '../../plugins/max-content-size';
import { mentionPluginKey } from '../../plugins/mentions';
import WithFlash from '../WithFlash';
import { ClickAreaMobile as ClickArea } from '../Addon';

export interface MobileEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

const MobileEditor: any = styled.div`
  min-height: 30px;
  width: 100%;
  max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;

  div > .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
`;
MobileEditor.displayName = 'MobileEditor';
const ContentArea = styled(ContentStyles)``;
ContentArea.displayName = 'ContentArea';

export default class Editor extends React.Component<
  EditorAppearanceComponentProps,
  any
> {
  static displayName = 'MobileEditor';

  private appearance: EditorAppearance = 'mobile';
  private containerElement: HTMLElement | undefined;

  private handleRef = (ref: HTMLElement) => {
    this.containerElement = ref;
    if (this.props.onUiReady) {
      this.props.onUiReady(ref);
    }
  };

  private renderMobile = ({
    maxContentSize,
  }: {
    maxContentSize: MaxContentSizePluginState;
  }) => {
    const {
      editorView,
      eventDispatcher,
      providerFactory,
      customContentComponents,
      maxHeight,
      disabled,
      editorDOMElement,
      dispatchAnalyticsEvent,
    } = this.props;
    const maxContentSizeReached =
      maxContentSize && maxContentSize.maxContentSizeReached;
    return (
      <WithFlash animate={maxContentSizeReached}>
        <MobileEditor
          isMaxContentSizeReached={maxContentSizeReached}
          maxHeight={maxHeight}
        >
          <ClickArea editorView={editorView}>
            <ContentArea innerRef={this.handleRef}>
              {customContentComponents}
              <PluginSlot
                editorView={editorView}
                eventDispatcher={eventDispatcher}
                providerFactory={providerFactory}
                appearance={this.appearance}
                containerElement={this.containerElement}
                disabled={!!disabled}
                dispatchAnalyticsEvent={dispatchAnalyticsEvent}
              />
              {editorDOMElement}
            </ContentArea>
          </ClickArea>
        </MobileEditor>
      </WithFlash>
    );
  };

  render() {
    const { eventDispatcher, editorView } = this.props;

    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{
          maxContentSize: maxContentSizePluginKey,
          mentions: mentionPluginKey,
        }}
        render={this.renderMobile}
      />
    );
  }
}
