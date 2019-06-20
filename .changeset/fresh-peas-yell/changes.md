Media Picker Browser component is now migrated to React.

## Previous vanilla js API:
```
// instantiation
const browser = await new MediaPicker('browser', context, pickerConfig).init();

// subscribe to upload events
this.mpBrowser.on('uploads-start', onUploadsStart);
this.mpBrowser.on('upload-preview-update', onUploadPreviewUpdate);
this.mpBrowser.on('upload-status-update', onUploadStatusUpdate);
this.mpBrowser.on('upload-processing', onUploadProcessing);
this.mpBrowser.on('upload-end', onUploadEnd);
this.mpBrowser.on('upload-error', onUploadError);

// open the native file browser
browser.browse();

// cancel ongoing upload
browse.cancel(uploadId);

// when we want to dispose the component
browser.teardown();
```

## New React API:

```
class BrowserConsumer etends React.Component {
  render() {
    return (
      <Browser
        isOpen={this.props.isOpen}
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
* No need to explicitly teardown the component. Unmounting the component will do the work
* `onBrowseFn` and `onCancelFn` are workarounds to open the file browser and cancel an ongoing upload. Refer to its type definitions for more info.
Before we were saving a ref and call `ref.browse()` or `ref.cancel()`.
* This is just an example trying to cover all props, but if you use `isOpen` there will be no need to provide `onBrowserFn`. Same case if you provide an `onBrowserFn` there's no need to provide `isOpen`. Ideally most scenarios will just need to provide `isOpen` prop in order to open the native file browser.
