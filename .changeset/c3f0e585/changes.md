- 

- MediaPicker Clipboard component is now a React Component

These changes provide a new React api for Clipboard component. First one to be delivered, coming next we are going to ship Browser, Dropzone and Popup.

Previous plain javascript API usage:

```typescript
// instanciate MediaPicker clipboard
const clipboardMediaPicker = await new MediaPicker(
  'clipboard'
  context,
  config,
);

// usage
clipboardMediaPicker.on('uploads-start', onUploadsStart);
clipboardMediaPicker.on('upload-preview-update', onUploadPreviewUpdate);
clipboardMediaPicker.on('upload-status-update', onUploadStatusUpdate);
clipboardMediaPicker.on('upload-processing', onUploadProcessing);
clipboardMediaPicker.on('upload-end', onUploadEnd);
clipboardMediaPicker.on('upload-error', onUploadError);

// activation / deactivation programatically
clipboardMediaPicker.activate();
clipboardMediaPicker.deactivate();
```

With the new React API we benefit from:
* No need to programatically activate/deactivate. We will just render the Clipboard component or not.
* Event handlers are provided by react props
* We don't need to use a MediaPicker constructor and specifiy which flavour we want (in this case 'clipboard'). We can basically `import { Clipboard } from '@atlaskit/media-picker'` directly and use it right away.

Example of new API:

```typescript
import { Clipboard } from '@atlaskit/media-picker';

<Clipboard
  context={context}
  config={config}
  onError={handleUploadError}
  onPreviewUpdate={handleUploadPreviewUpdate}
  onProcessing={handleReady}
/>
```

This is the first component we migrate fully and integrates seemingly with the Editor. Follow up on this ticket to see what will be the next steps on this new API:
https://product-fabric.atlassian.net/browse/MS-1942
