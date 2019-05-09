- Remove Binary component from MediaPicker

If you want to upload a file (string or blob) to media, you should instead use **context.file.upload** from **@atlaskit/media-core**

```typescript
import {ContextFactory} from '@atlaskit/media-core'

const mediaContext = ContextFactory.create()

mediaContext.file.upload({
  content: 'some-external-url',
  name: 'some-file-name.png',
  collection: 'destination-collection'
})
```

For more info check `atlaskit-mk-2/packages/media/media-client/src/client/file-fetcher.ts`