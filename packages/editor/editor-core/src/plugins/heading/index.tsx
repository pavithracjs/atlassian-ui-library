import React, { RefObject } from 'react';
import { heading } from '@atlaskit/adf-schema';
import { EditorPlugin } from '../../types';
import { createPlugin } from './pm-plugins/main';
import {
  clipboardApiSupported,
  copyToClipboard,
  copyToClipboardLegacy,
  CopyArea,
} from '@atlaskit/editor-common';

const copyAreaRef: RefObject<HTMLElement> = React.createRef();

export const copyTextToClipboard = (textToCopy: string): Promise<void> =>
  clipboardApiSupported()
    ? copyToClipboard(textToCopy)
    : copyToClipboardLegacy(textToCopy, copyAreaRef.current);

const headingPlugin = (): EditorPlugin => ({
  nodes() {
    return [{ name: 'heading', node: heading }];
  },

  pmPlugins() {
    return [
      {
        name: 'heading',
        plugin: ({ portalProviderAPI, dispatchAnalyticsEvent }) =>
          createPlugin(portalProviderAPI, dispatchAnalyticsEvent),
      },
    ];
  },

  contentComponent: () =>
    clipboardApiSupported() ? null : <CopyArea ref={copyAreaRef} />,
});

export default headingPlugin;
