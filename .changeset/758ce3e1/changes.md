- Add event emitter api to context + add first known event 'file-added'

Integrators can now do:

```
import {ContextFactory, FileState} from '@atlaskit/media-core'

const context = ContextFactory.create();

context.on('file-added', (file: FileState) => {
  console.log(file.id)
})
```

check the **FileState** for the all the properties included in the payload