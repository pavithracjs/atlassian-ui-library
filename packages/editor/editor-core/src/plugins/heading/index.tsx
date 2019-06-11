import React, { RefObject } from 'react';
import { heading } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import { CopyArea } from '@atlaskit/editor-common/src/ui/CopyTextProvider';
import {
  clipboardApiSupported,
  copyToClipboard,
  copyToClipboardLegacy,
} from '@atlaskit/editor-common/src/utils/copyToClipboard';

const copyAreaRef: RefObject<HTMLElement> = React.createRef();

export const copyTextToClipboard = (textToCopy: string): Promise<void> => {
  if (clipboardApiSupported) {
    return copyToClipboard(textToCopy);
  }
  return copyToClipboardLegacy(textToCopy, copyAreaRef.current);
};

const headingPlugin = (): EditorPlugin => ({
  nodes() {
    return [{ name: 'heading', node: heading }];
  },

  pmPlugins() {
    return [
      {
        name: 'heading',
        plugin: ({ portalProviderAPI }) => createPlugin(portalProviderAPI),
      },
    ];
  },

  contentComponent: () =>
    clipboardApiSupported ? null : <CopyArea ref={copyAreaRef} />,
});

export default headingPlugin;
