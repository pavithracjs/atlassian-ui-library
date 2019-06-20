add getAuthFromContext field into MediaClientConfig

Now products can provide auth based on a `contextId` **ARI**

```
import {MediaClientConfig} from '@atlaskit/media-core';

const config: MediaClientConfig = {
  authProvider, // already exists
  getAuthFromContext(clientId: string): Promise<Auth> // new optional prop
}
```