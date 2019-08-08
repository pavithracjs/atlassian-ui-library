import React, { RefObject } from 'react';
import { heading } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { CopyArea } from '@atlaskit/editor-common/src/ui/CopyTextProvider';
import {
  clipboardApiSupported,
  copyToClipboard,
  copyToClipboardLegacy,
} from '@atlaskit/editor-common/src/utils/copy-to-clipboard';
import { getCurrentUrlWithHash } from '@atlaskit/editor-common/src/utils/urls';

const copyAreaRef: RefObject<HTMLElement> = React.createRef();

export const copyHeadingAnchorLink = (anchorName: string): Promise<void> => {
  const link = getCurrentUrlWithHash(anchorName);
  if (clipboardApiSupported()) {
    return copyToClipboard(link);
  }
  return copyToClipboardLegacy(link, copyAreaRef.current);
};

const headingPlugin = (): EditorPlugin => ({
  nodes() {
    return [{ name: 'heading', node: heading }];
  },

  pmPlugins() {
    return [
      {
        name: 'heading',
        plugin: ({ dispatchAnalyticsEvent, reactContext }) =>
          createPlugin(
            copyHeadingAnchorLink,
            dispatchAnalyticsEvent,
            reactContext,
          ),
      },
    ];
  },

  contentComponent: () =>
    clipboardApiSupported() ? null : <CopyArea ref={copyAreaRef} />,
});

export default headingPlugin;
