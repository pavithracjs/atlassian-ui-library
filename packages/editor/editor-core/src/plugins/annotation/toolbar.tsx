import { defineMessages } from 'react-intl';
import { INLINE_COMMENT } from '@atlaskit/adf-schema';
import CommentIcon from '@atlaskit/icon/glyph/comment';

import { FloatingToolbarHandler } from '../floating-toolbar/types';
import { pluginKey, AnnotationPluginState } from './pm-plugins/main';
import { setAnnotationQueryMarkAtCurrentPos } from './commands';

export const messages = defineMessages({
  info: {
    id: 'fabric.editor.info',
    defaultMessage: 'Info',
    description:
      'Panels provide a way to highlight text. The info panel has a blue background.',
  },
});

const getToolbarConfig: FloatingToolbarHandler = state => {
  const annotationState: AnnotationPluginState | undefined = pluginKey.getState(
    state,
  );

  if (
    annotationState &&
    annotationState.activeText &&
    !annotationState.showComponent
  ) {
    return {
      title: 'Annotate floating toolbar',
      getDomRef: () => annotationState.dom,
      nodeType: state.schema.nodes.paragraph,
      items: [
        {
          type: 'button',
          icon: CommentIcon,
          showTitle: true,
          title: 'Comment',
          onClick: setAnnotationQueryMarkAtCurrentPos(INLINE_COMMENT),
        },
      ],
    };
  }
  return;
};

export default getToolbarConfig;
