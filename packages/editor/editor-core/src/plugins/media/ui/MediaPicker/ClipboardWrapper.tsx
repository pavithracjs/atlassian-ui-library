import * as React from 'react';
import PickerFacadeProvider from './PickerFacadeProvider';
import { MediaPluginState } from '../../pm-plugins/main';
import { Clipboard } from '@atlaskit/media-picker';

type Props = {
  mediaState: MediaPluginState;
};

export const ClipboardWrapper = ({ mediaState }: Props) => (
  <PickerFacadeProvider mediaState={mediaState} analyticsName="clipboard">
    {({ mediaClientConfig, config, pickerFacadeInstance }) => (
      <Clipboard
        mediaClientConfig={mediaClientConfig}
        config={config}
        onError={pickerFacadeInstance.handleUploadError}
        onPreviewUpdate={pickerFacadeInstance.handleUploadPreviewUpdate}
        onProcessing={pickerFacadeInstance.handleReady}
      />
    )}
  </PickerFacadeProvider>
);
