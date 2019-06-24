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
* In some cases you will need to provide either `onBrowserFn` or `onCancelFn` in order to open the file browser or to cancel an ongoing upload programatically. 
Typically this will be needed when this component is being rendered outside a react component, and we cannot take advantage of using `isOpen` directly. 
A good example of this can be seen in -> https://bitbucket.org/atlassian/atlaskit-mk-2/src/d7a2e4a8fb8e35b841d751f5ecccff188c955c7a/packages/editor/editor-core/src/plugins/media/index.tsx#lines-178 where `BrowserMediaPickerWrapper` is rendered.

Basically if we render `Browser` component in isolation (meaning, not inside another react component), we will need to do something like:

```
const saveOpenBrowserFunction = (browse) => this.openBrowser = browse;

...

<Browser
  onBrowseFn={(browse) => saveOpenBrowserFunction(browse)}
  config={config}
  context={context}
  onProcessing={onProcessing}
  onError={onError}
  onPreviewUpdate={onPreviewUpdate}
/>
```

At a later point we will just need to call `this.openBrowser` function in that example, in order to open the native File browser. Same applies to `onCancelFn`.
