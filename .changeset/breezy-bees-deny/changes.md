Emit processed state when file gets copied

Fixes CEMS-244: 

Currently some properties are missing after a file get’s copied (inserted from MediaPicker) and when the user tries to see on MediaViewer, the preview fails to load.

It happens for files that require artifacts, like documents or videos