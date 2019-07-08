Media Picker Dropone component is now migrated to React.

  - Previous vanilla js API:

  ```
  // instantiation
  const dropzone = await new MediaPicker('dropzone', context, pickerConfig).init();

  // subscribe to upload events
  dropzone.on('uploads-start', onUploadsStart);
  dropzone.on('upload-preview-update', onUploadPreviewUpdate);
  dropzone.on('upload-status-update', onUploadStatusUpdate);
  dropzone.on('upload-processing', onUploadProcessing);
  dropzone.on('upload-end', onUploadEnd);
  dropzone.on('upload-error', onUploadError);

  
  // activate/deactivate dropone
  dropzone.activate();
  dropzone.deactivate();

  // cancel ongoing upload
  dropzone.cancel(uploadId);

  // when we want to dispose the component
  dropzone.teardown();
  ```

  - New React API:

  ```
  class DropzoneConsumer extends React.Component {
    render() {
      return (
        <Dropzone
          config={config}
          context={context}
          onProcessing={onProcessing}
          onError={onError}
          onPreviewUpdate={onPreviewUpdate}
        />
      )
    }
  }
  ```

  Notes on new API:

  - old `MediaPicker` constructor does not recieve `pickerType` as first parameter anymore, since the only component left to migrate to react is `popup`. 
  Meaning that if before we were doing:
   ```
   new MediaPicker('popup', context, config)
   ```
  now we will need to just do
   ```
   new MediaPicker(context, config)
   ```

  - No need to explicitly teardown the component. Unmounting the component will do the work
  
  - `onCancelFn` is a workaround to cancel an ongoing upload. Refer to its type definitions for more info. Before we were saving a ref and calling `ref.cancel()`.

  Basically if we render `Dropzone` component in isolation (meaning, not inside another react component), we will need to do something like:

  ```
  const saveCancelUploadFn = (cancel) => this.cancelUpload = cancel;

  ...

  <Dropzone
    onCancelFn={(cancel) => saveCancelUploadFn(cancel)}
    config={config}
    context={context}
    onProcessing={onProcessing}
    onError={onError}
    onPreviewUpdate={onPreviewUpdate}
  />
  ```

  At a later point we will just need to call `this.cancelUpload` function in that example, in order to cancel an ongoing upload if needed.
