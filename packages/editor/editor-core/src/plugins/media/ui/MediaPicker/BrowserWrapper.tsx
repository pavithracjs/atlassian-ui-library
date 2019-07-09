import * as React from 'react';
import PickerFacadeProvider from './PickerFacadeProvider';
import { MediaPluginState } from '../../pm-plugins/main';
import { Browser } from '@atlaskit/media-picker';

type Props = {
  mediaState: MediaPluginState;
  isOpen?: boolean;
  onBrowseFn: (browse: () => void) => void;
};

export const BrowserWrapper = ({ mediaState, isOpen, onBrowseFn }: Props) => (
  <PickerFacadeProvider mediaState={mediaState} analyticsName="browser">
    {({ mediaClientConfig, config, pickerFacadeInstance }) => (
      <Browser
        onBrowseFn={onBrowseFn}
        isOpen={isOpen}
        config={config}
        mediaClientConfig={mediaClientConfig}
        onProcessing={pickerFacadeInstance.handleReady}
        onError={pickerFacadeInstance.handleUploadError}
        onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
      />
    )}
  </PickerFacadeProvider>
);
