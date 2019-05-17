import * as React from 'react';
import AnnotateIcon from '@atlaskit/icon/glyph/media-services/annotate';
import { MediaClient } from '@atlaskit/media-client';
import { EditorView } from 'prosemirror-view';
import { defineMessages, InjectedIntl } from 'react-intl';
import { Command } from '../../../types';
import Button from '../../floating-toolbar/ui/Button';
import Separator from '../../floating-toolbar/ui/Separator';
import { MediaPluginState, stateKey } from '../pm-plugins/main';

const annotate: Command = state => {
  const pluginState: MediaPluginState | undefined = stateKey.getState(state);
  if (!pluginState) {
    return false;
  }

  pluginState.openMediaEditor();
  return true;
};

export const messages = defineMessages({
  annotate: {
    id: 'fabric.editor.annotate',
    defaultMessage: 'Annotate',
    description:
      'Annotate an image by drawing arrows, adding text, or scribbles.',
  },
});

type AnnotationToolbarProps = {
  viewMediaClient: MediaClient;
  id: string;
  intl: InjectedIntl;
  view?: EditorView;
};

export class AnnotationToolbar extends React.Component<AnnotationToolbarProps> {
  state = {
    isImage: false,
  };

  async componentDidMount() {
    await this.checkIsImage();
  }

  async checkIsImage() {
    const state = await this.props.viewMediaClient.file.getCurrentState(
      this.props.id,
    );

    if (state && state.status !== 'error' && state.mediaType === 'image') {
      this.setState({
        isImage: true,
      });
    }
  }

  componentDidUpdate(prevProps: AnnotationToolbarProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({ isImage: false }, () => {
        this.checkIsImage();
      });
    }
  }

  onClickAnnotation = () => {
    const { view } = this.props;
    if (view) {
      annotate(view.state, view.dispatch);
    }
  };

  render() {
    if (!this.state.isImage) {
      return null;
    }

    const { intl } = this.props;

    const title = intl.formatMessage(messages.annotate);

    return (
      <>
        <Separator />
        <Button
          title={title}
          icon={<AnnotateIcon label={title} />}
          onClick={this.onClickAnnotation}
        />
      </>
    );
  }
}

export const renderAnnotationButton = (
  pluginState: MediaPluginState,
  intl: InjectedIntl,
) => {
  return (view?: EditorView, idx?: number) => {
    const selectedContainer = pluginState.selectedMediaContainerNode();
    if (!selectedContainer) {
      return null;
    }

    return (
      <AnnotationToolbar
        key={idx}
        viewMediaClient={pluginState.mediaClient!}
        id={selectedContainer.firstChild!.attrs.id}
        view={view}
        intl={intl}
      />
    );
  };
};
