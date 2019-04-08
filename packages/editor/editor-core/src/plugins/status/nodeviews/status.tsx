import * as React from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';
import styled from 'styled-components';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Status } from '@atlaskit/status';
import { pluginKey, StatusState } from '../plugin';
import { setStatusPickerAt } from '../actions';
import { colors } from '@atlaskit/theme';
import WithPluginState from '../../../ui/WithPluginState';
import { EventDispatcher } from '../../../event-dispatcher';
import { ZeroWidthSpace } from '../../../utils';

const { B100 } = colors;

export interface StatusContainerProps {
  selected: boolean;
  placeholderStyle: boolean;
}

export const StatusContainer = styled.span`
  cursor: pointer;

  display: inline-block;
  border-radius: 5px;
  max-width: 100%;

  /* Prevent responsive layouts increasing height of container by changing
     font size and therefore line-height. */
  line-height: 0;

  opacity: ${(props: StatusContainerProps) =>
    props.placeholderStyle ? 0.5 : 1};

  border: 2px solid ${(props: StatusContainerProps) =>
    props.selected ? B100 : 'transparent'};
  }

  * ::selection {
    background-color: transparent;
  }
`;

export const messages = defineMessages({
  placeholder: {
    id: 'fabric.editor.statusPlaceholder',
    defaultMessage: 'Set a status',
    description:
      'Placeholder description for an empty (new) status item in the editor',
  },
});

export interface Props {
  node: PMNode;
  view: EditorView;
  eventDispatcher?: EventDispatcher;
}

class StatusNodeView extends React.Component<Props & InjectedIntlProps, {}> {
  constructor(props: Props & InjectedIntlProps) {
    super(props);
  }

  render() {
    const { eventDispatcher, view } = this.props;
    return (
      <WithPluginState
        plugins={{
          pluginState: pluginKey,
        }}
        editorView={view}
        eventDispatcher={eventDispatcher}
        render={({ pluginState }: { pluginState: StatusState }) => {
          const {
            node: {
              attrs: { text, color, localId, style },
            },
            intl: { formatMessage },
          } = this.props;

          const statusText = text ? text : formatMessage(messages.placeholder);
          const selectedLocalId =
            pluginState.selectedStatus && pluginState.selectedStatus.localId;
          const selected = selectedLocalId === localId;

          return (
            <span>
              <StatusContainer selected={selected} placeholderStyle={!text}>
                <Status
                  text={statusText}
                  color={color}
                  localId={localId}
                  style={style}
                  onClick={this.handleClick}
                />
              </StatusContainer>
              {ZeroWidthSpace}
            </span>
          );
        }}
      />
    );
  }

  private handleClick = (event: React.SyntheticEvent<any>) => {
    if (event.nativeEvent.stopImmediatePropagation) {
      event.nativeEvent.stopImmediatePropagation();
    }
    const { state, dispatch } = this.props.view;
    setStatusPickerAt(state.selection.from)(state, dispatch);
  };
}

export default injectIntl(StatusNodeView);
